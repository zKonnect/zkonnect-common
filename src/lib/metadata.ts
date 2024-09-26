import { Metadata } from "next";

export function constructMetaData({
  title = "zKonnect",
  description = "Your web3 dapp for effortless event creation and participation!",
  image = "/thumbnail.png", // put a thumbnail.png in public folder, resolution 1200x630
  authors = { name: "zKonnect team", url: "https://zkonnect.social/" },
  creator = "zKonnect team",
  generator = "Next.js",
  publisher = "zKonnect team",
  robots = "index, follow",
}: {
  title?: string;
  description?: string;
  image?: string;
  authors?: { name: string; url: string };
  creator?: string;
  generator?: string;
  publisher?: string;
  robots?: string;
} = {}): Metadata {
  return {
    title,
    description,
    authors,
    creator,
    generator,
    publisher,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Manice18heree",
      creator: "@Manice18heree",
      creatorId: "@Manice18heree",
      title,
      description,
      images: [image],
    },
    icons: {
      icon: [
        {
          media: "(prefers-color-scheme: light)",
          url: "/assets/brand-icons/favicon.ico",
          href: "/assets/brand-icons/favicon.ico",
        },
        {
          media: "(prefers-color-scheme: dark)",
          url: "/assets/brand-icons/favicon.ico",
          href: "/assets/brand-icons/favicon.ico",
        },
      ],
    },
    metadataBase: new URL("https://zkonnect.social/"),
    robots,
  };
}
