import { z } from "zod";

const creatorSignupFormSchema = z.object({
  creatorName: z.string().trim().min(1, "Cannot be empty"),
  domainOfEvent: z.string().trim().min(1, "Cannot be empty"),
  expectedNumberOfEvents: z.coerce
    .number()
    .gte(1, "Value must be greater than 0"),
});

const nativeTokenEnum = z.enum(["SOL", "USDC", "USDT", "BTC", "ETH"]);

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const eventCreationFormSchema = z.object({
  eventName: z.string().trim().min(1, "Cannot be empty"),
  eventDescription: z.string().trim().min(1, "Cannot be empty"),
  eventDate: z.date({
    required_error: "A date of event is required",
  }),
  bannerUrl: z
    .any()
    .optional()
    .refine((files) => {
      return !files?.[0] || files[0].size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) =>
        !files?.[0] || ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
  ticketPrice: z.coerce
    .number()
    .gte(0, "Value must be greater than or equal to 0"),
  totalTickets: z.coerce.number().gte(1, "Value must be greater than 0"),
  nativePaymentToken: nativeTokenEnum,
});

export { creatorSignupFormSchema, eventCreationFormSchema };
