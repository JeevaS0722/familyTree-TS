const { execSync } = require('child_process');

function isCodeCliInstalled(cli) {
  try {
    execSync(`${cli} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const clis = ['code', 'code-insiders'];

clis.forEach((cli) => {
  if (isCodeCliInstalled(cli)) {
    const extensions = [
      'dbaeumer.vscode-eslint',
      'esbenp.prettier-vscode',
      'streetsidesoftware.code-spell-checker',
    ];

    extensions.forEach((extension) => {
      try {
        execSync(`${cli} --install-extension ${extension} --force`, {
          stdio: 'inherit',
        });
        console.log(`Successfully installed ${extension} using ${cli}`);
      } catch (error) {
        console.error(`Error installing ${extension} using ${cli}: ${error}`);
      }
    });
  } else {
    console.warn(`${cli} CLI not installed. Skipping extension installation.`);
  }
});
