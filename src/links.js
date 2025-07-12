const links = new Map();

const LINK_SRC = process.env.LINK_SRC;
const HOME_URL = process.env.HOME_URL;

if (!LINK_SRC) {
  console.log("LINK_SRC must be set");
  process.exit(1);
}

if (!URL.canParse(LINK_SRC)) {
  console.log("LINK_SRC must be parseable URL");
  process.exit(2);
}

if (!HOME_URL) {
  console.log("HOME_URL must be set");
  process.exit(3);
}

if (!URL.canParse(HOME_URL)) {
  console.log("HOME_URL must be parseable URL");
  process.exit(4);
}

const home = {
  next: { url: HOME_URL },
  previous: { url: HOME_URL },
};

export const initCache = async () => {
  const linkData = await fetch(LINK_SRC).then((r) => r.json());

  for (let i = 0; i < linkData.length; i += 1) {
    const previous = i === 0 ? linkData[linkData.length - 1] : linkData[i - 1];
    const next = i === linkData.length - 1 ? linkData[0] : linkData[i + 1];
    links.set(linkData[i].url, { next, previous });
  }

  // Update cache every ten minutes
  setTimeout(initCache, 600_000);
};

export const getLink = (from) => {
  if (links.has(from)) {
    return links.get(from);
  }
  return home;
};

export const getRandom = () => {
  return Array.from(links.values())[Math.floor(Math.random() * links.size)];
};
