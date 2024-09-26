import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileType = searchParams.get("fileType");

  if (fileType !== "image" && fileType !== "json") {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  try {
    if (fileType === "image") {
      const data = await request.formData();
      const file: File | null = data.get("file") as unknown as File;
      data.append("file", file);
      data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
          body: data,
        },
      );
      const { IpfsHash } = await res.json();

      return NextResponse.json({ IpfsHash }, { status: 200 });
    } else {
      const { eventName, creatorName, description, image, meetLink, date } =
        await request.json();

      const options = JSON.stringify({
        pinataContent: {
          name: `${eventName} | ${creatorName}`,
          description: description,
          image: image,
          external_url: meetLink,
          attributes: [
            {
              trait_type: "Meet Link",
              value: meetLink,
            },
            {
              trait_type: "Date for the event",
              value: date,
            },
          ],
        },
        pinataMetadata: {
          name: `${eventName}.json`,
        },
      });

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
          body: options,
        },
      );

      const { IpfsHash } = await res.json();

      return NextResponse.json({ IpfsHash }, { status: 200 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
