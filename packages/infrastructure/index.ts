import { SelfContainedImageRepository } from "./components/SelfContainedImageRepository";

const serverImageRepository = new SelfContainedImageRepository(
  "server-image-repository",
  {
    image: {
      name: "server",
      context: "../server",
      dockerfile: "../server/Dockerfile",
    },
  }
);

export const imageName = serverImageRepository.image.imageName;
