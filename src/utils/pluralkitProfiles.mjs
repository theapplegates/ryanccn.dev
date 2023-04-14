import sharp from 'sharp';

import { copyFile, readdir, rm } from 'fs/promises';

import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

import { cyan, dim, yellow } from 'kleur/colors';
import { join } from 'path';

const SYSTEM_ID = 'fxyvj';
const DEFAULT_MEMBER = 'kavdq';
const ICON_DIRECTORY = join(process.cwd(), 'src/assets/icons/dynamic');

await readdir(ICON_DIRECTORY).then(async (files) => {
  for (const f of files) {
    const fullPath = join(ICON_DIRECTORY, f);
    await rm(fullPath);
  }

  console.log(dim(`Deleted ${files.length} existing files`));
});

const members = await fetch(
  `https://api.pluralkit.me/v2/systems/${SYSTEM_ID}/members`
).then((res) => {
  if (!res.ok)
    throw new Error(
      `Error fetching ${res.url}: ${res.status} ${res.statusText}`
    );

  return res.json();
});

for (const member of members) {
  if (!member.avatar_url) {
    console.warn(
      yellow(`Skipping ${member.name} (${member.id}) as no avatar URL is set`)
    );
    continue;
  }

  console.log(
    `Downloading avatar for ${cyan(`${member.name} (${member.id})`)}`
  );

  const rawAvatarPath = join(ICON_DIRECTORY, `${member.id}.raw.png`);
  const avatarPath = join(ICON_DIRECTORY, `${member.id}.png`);

  const res = await fetch(member.avatar_url);
  const fileStream = createWriteStream(rawAvatarPath);

  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  fileStream.close();

  console.log(`Resizing ${cyan(`${member.id}.raw.png`)} to 512w`);
  await sharp(rawAvatarPath).resize({ width: 64 }).toFile(avatarPath);

  await rm(rawAvatarPath);

  if (member.id === DEFAULT_MEMBER) {
    console.log(`Setting ${cyan(`${member.name} (${member.id})`)} as default`);
    await copyFile(avatarPath, join(ICON_DIRECTORY, `../dynamic.png`));
  }
}
