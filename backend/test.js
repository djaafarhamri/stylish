const ACCESS_KEY = "tccExsYAG6IzzCTwFcLjeZDDNTM2IKX32MFPBwL4yLkMCS0awT0br3LW";

async function getRandomImage(category, width, height) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${category}&per_page=1`,
    {
      headers: { Authorization: `${ACCESS_KEY}` }
    }
  );
  const data = await response.json();
  console.log(data)
  if (data.photos?.length > 0) {
    const imageUrl = data.photos[0].src.original;
    return `${imageUrl}?w=${width}&h=${height}`;
  }

  throw new Error("No images found");
}

getRandomImage("dresses", 800, 600).then(console.log).catch(console.error);
