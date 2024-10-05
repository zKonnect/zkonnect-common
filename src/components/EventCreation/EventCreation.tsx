"use client";

import { useState } from "react";

import { z } from "zod";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

import { cn } from "@/lib/utils";
import { eventCreationFormSchema } from "@/lib/validation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadDropzone from "@/components/Common/UploadDropzone";
import { TimePickerDemo } from "@/components/ui/DateTime/time-picker-demo";
import { usePreview } from "@/hooks/use-preview";
import { useZkonnect } from "@/hooks/useZkonnect";
import { createEventAction, getCreatorDataAction } from "@/actions";
import { ConfirmEvent } from "./confirmEvent";

type EventCreationFormSchemaType = z.infer<typeof eventCreationFormSchema>;

const EventCreation = () => {
  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    "confirmed",
  );
  const umi = createUmi(connection).use(mplBubblegum());
  umi.use(walletAdapterIdentity(wallet));

  const { createTheEvent } = useZkonnect();

  const toggle = usePreview((store) => store.toggle);
  const isOpen = usePreview((store) => store.isPreviewOpen);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [meetUrl, setMeetUrl] = useState<string>("");

  const form = useForm<EventCreationFormSchemaType>({
    resolver: zodResolver(eventCreationFormSchema),
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventDate: new Date(),
      bannerUrl: undefined,
      nativePaymentToken: "USDC",
    },
  });

  const { isValid } = useFormState({ control: form.control });

  async function onSubmit(values: z.infer<typeof eventCreationFormSchema>) {
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      let promise: Promise<void>;
      promise = new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        formData.set("file", values.bannerUrl[0]);
        fetch(
          `/api/ipfsUpload?fileType=image&hostWallet=${wallet.publicKey!.toString()}`,
          {
            method: "POST",
            body: formData,
          },
        )
          .then(async (response) => {
            const uploadedImage = await response.json();
            const bannerUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadedImage.IpfsHash}`;
            const createMerkle = await fetch(
              `/api/createMerkleTree?hostWallet=${wallet.publicKey!.toString()}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  totalNFTs: values.totalTickets,
                }),
              },
            );
            await createMerkle.json().then(async (merkleTreeAddr) => {
              const { creatorDomain, creatorName, creatorId } =
                await getCreatorDataAction(wallet.publicKey!.toString());

              const roomIdData = await fetch(
                `/api/createRoom?title=${values.eventName}&hostWallet=${wallet.publicKey!.toString()}&dateTime=${values.eventDate.getTime().toString()}`,
              );

              const roomId = await roomIdData
                .json()
                .then((data) => data.roomId);

              setMeetUrl(`https://zkonnect.social/meet/${roomId}`);

              const jsonUpload = await fetch(
                `/api/ipfsUpload?fileType=json&hostWallet=${wallet.publicKey!.toString()}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    eventName: values.eventName,
                    creatorName: creatorName,
                    description: values.eventDescription,
                    image: bannerUrl,
                    meetLink: `https://zkonnect.social/meet/${roomId}`,
                    date: values.eventDate.toLocaleDateString(),
                  }),
                },
              );
              const jsonUploadResponse = await jsonUpload.json();

              const nftUri = `https://pink-magnetic-panther-830.mypinata.cloud/ipfs/${jsonUploadResponse.IpfsHash}`;

              const response = await fetch(
                `/api/createCollectionNft?hostWallet=${wallet.publicKey!.toString()}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    creatorAddress: wallet.publicKey!.toString(),
                    eventName: values.eventName,
                    nftUri: nftUri,
                  }),
                },
              );
              const collectionNftAddr = await response.json();

              await createTheEvent({
                eventName: values.eventName,
                eventDescription: values.eventDescription,
                creatorName: creatorName!,
                creatorDomain: creatorDomain!,
                bannerUrl: bannerUrl,
                dateTime: values.eventDate.getTime(),
                location: `https://zkonnect.social/meet/${roomId}`,
                nftUri: nftUri,
                ticketPrice: values.ticketPrice,
                totalTickets: values.totalTickets,
                tokenType: values.nativePaymentToken,
                collectionNft: collectionNftAddr.mint,
                merkleTreeAddr: new PublicKey(merkleTreeAddr.merkleTreeAddr),
              });

              const blinkUrl = `https://zkonnect.social/api/actions/buyTicket?eventName=${values.eventName}&address=${wallet.publicKey!.toString()}`;

              await createEventAction({
                eventName: values.eventName,
                eventDescription: values.eventDescription,
                eventBanner: bannerUrl,
                eventDate: values.eventDate,
                blink: encodeURI(blinkUrl),
                meetLink: `https://zkonnect.social/meet/${roomId}`,
                creatorId: creatorId,
                nativeToken: values.nativePaymentToken,
                ticketPrice: values.ticketPrice,
                totalTickets: values.totalTickets,
                collectionAddress: collectionNftAddr.mint,
                roomId: roomId,
                hostWalletAddress: wallet.publicKey!.toString(),
              });
            });
          })
          .then(() => {
            resolve();
            toggle();
          })
          .catch((error) => reject(error));
      });

      toast.promise(promise, {
        loading: "Your event is being created",
        success: "Event created successfully!",
        error: "Error creating event",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4 sm:min-w-[500px]"
      >
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black dark:text-white">
                Event Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. An Online Event - By John Doe"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The name of the event you want to create.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black dark:text-white">
                Event Description
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. A description of the event"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                A brief description of the event you want to create.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Event Banner
              </FormLabel>
              <FormControl>
                <UploadDropzone
                  baseImage={true}
                  onChange={field.onChange}
                  setSelectedImage={setSelectedImage}
                />
              </FormControl>
              <FormDescription>
                A banner image for the event you want to create.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time of Event</FormLabel>
              <Popover>
                <PopoverTrigger asChild className="h-[50px]">
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date & time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePickerDemo
                      setDate={field.onChange}
                      date={field.value}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The Date on which you want to host the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-black">
                  Ticket Price
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 2"
                    {...field}
                    className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                  />
                </FormControl>
                <FormDescription>
                  The price of the ticket for the event you want to create
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nativePaymentToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Native Payment Token</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-[50px]">
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USDC">
                      <div className="flex items-center space-x-2">
                        <Avatar className="size-7">
                          <AvatarImage src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694" />
                          <AvatarFallback>USDC</AvatarFallback>
                        </Avatar>
                        <span>USDC</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SOL">
                      <div className="flex items-center space-x-2">
                        <Avatar className="size-7">
                          <AvatarImage src="https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756" />
                          <AvatarFallback>SOL</AvatarFallback>
                        </Avatar>
                        <span>SOL</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The native payment token you want to users to pay
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="totalTickets"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Total Tickets
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. 100"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                Total number of tickets you want to sell for the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ConfirmEvent
          disabled={!isValid}
          onConfirm={form.handleSubmit(onSubmit)}
          eventName={form.getValues().eventName}
          eventDescription={form.getValues().eventDescription}
          dateTime={form.getValues().eventDate.toLocaleDateString()}
          ticketPrice={form.getValues().ticketPrice}
          totalTickets={form.getValues().totalTickets}
          tokenType={form.getValues().nativePaymentToken}
          selectedImage={
            selectedImage !== null ? URL.createObjectURL(selectedImage) : ""
          }
          walletAddr={wallet.publicKey?.toString()}
          newMeetUrl={meetUrl}
        />
      </form>
    </Form>
  );
};

export default EventCreation;
