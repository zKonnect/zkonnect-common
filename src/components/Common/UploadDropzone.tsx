import { SetStateAction, useState } from "react";

import { Cloud, File as File2 } from "lucide-react";
import Dropzone from "react-dropzone";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const UploadDropzone = ({
  baseImage = false,
  onChange,
  setSelectedImage,
}: {
  baseImage: boolean;
  onChange: (webFiles: any) => void;
  setSelectedImage: (file: File) => void;
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProg) => {
        if (prevProg >= 95) {
          clearInterval(interval);
          return prevProg;
        }
        return prevProg + 5;
      });
    }, 500);
    return interval;
  };

  const convertToWebP = async (file: File) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            const webpFile = new File([blob!], `${file.name}.webp`, {
              type: "image/webp",
            });
            resolve(webpFile);
          },
          "image/webp",
          0.8,
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to convert image to WebP"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        const webpFiles = await Promise.all(
          acceptedFile.map(async (file) => {
            const webpFile = await convertToWebP(file);
            setSelectedImage(file);
            return webpFile;
          }),
        );

        if (onChange) {
          onChange(webpFiles);
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className={cn(
            "my-4 rounded-lg border border-dashed border-gray-300",
            baseImage ? "h-64" : "h-46",
          )}
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                <p
                  className={cn(
                    "mb-2 text-center text-zinc-700",
                    baseImage ? "text-sm" : "text-xs",
                  )}
                >
                  Click to upload{" "}
                  {baseImage && (
                    <span className="font-semibold text-zinc-700">
                      Event Banner
                    </span>
                  )}{" "}
                  or drag and drop
                </p>
                <p className="text-manatee text-xs">
                  IMG up to{" "}
                  <span className="font-semibold text-zinc-700">4MB</span>
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div
                  className={cn(
                    "flex items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200",
                    baseImage ? "max-w-xs" : "w-[130px]",
                  )}
                >
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading && baseImage ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                      Done
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
