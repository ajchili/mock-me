import { SelfContainedImageRepository } from "./components/SelfContainedImageRepository";

const assetImageRepository = new SelfContainedImageRepository(
  "asset-image-repository",
  {
    image: {
      name: "asset",
    },
  }
);
const serverImageRepository = new SelfContainedImageRepository(
  "server-image-repository",
  {
    image: {
      name: "server",
    },
  }
);

export const assetImageName = assetImageRepository.image.imageName;
export const serverImageName = serverImageRepository.image.imageName;
