import sharp from 'sharp';

import { createWriteStream } from 'fs';
import { copyFile, readdir, rm } from 'fs/promises';
import { ofetch } from 'ofetch';

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

const members = await ofetch(
  `https://api.pluralkit.me/v2/systems/${SYSTEM_ID}/members`
);

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

  const res = await ofetch.native(member.avatar_url);
  const fileStream = createWriteStream(rawAvatarPath);

  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
  fileStream.close();

  console.log(`Resizing ${cyan(`${member.id}.raw.png`)} to 512w`);
  await sharp(rawAvatarPath).resize({ width: 64 }).toFile(avatarPath);

  await rm(rawAvatarPath);

  if (member.id === DEFAULT_MEMBER) {
    console.log(`Setting ${cyan(`${member.name} (${member.id})`)} as default`);
    await copyFile(avatarPath, join(ICON_DIRECTORY, `default.png`));
  }
}
