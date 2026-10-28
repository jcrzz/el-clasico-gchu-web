import { z } from "zod";

const httpUrl = z
  .string()
  .trim()
  .max(600)
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "Usá un link que empiece con http:// o https://.",
  );

export const showInputSchema = z
  .object({
    id: z.string().trim().min(1).optional(),
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Elegí una fecha válida."),
    time: z
      .string()
      .trim()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Usá un horario válido.")
      .or(z.literal(""))
      .optional()
      .default(""),
    city: z.string().trim().min(2, "Indicá la ciudad.").max(80),
    country: z.enum(["AR", "UY"]),
    venue: z.string().trim().min(2, "Indicá el venue.").max(140),
    ticketUrl: httpUrl.optional().default(""),
    notes: z.string().trim().max(400).optional().default(""),
    soldOut: z.boolean().optional().default(false),
    freeEntry: z.boolean().optional().default(false),
  })
  .superRefine((value, ctx) => {
    if (value.freeEntry && value.soldOut) {
      ctx.addIssue({
        code: "custom",
        path: ["freeEntry"],
        message: "Entrada libre y sold out son excluyentes.",
      });
    }

    if (!value.soldOut && !value.freeEntry && !value.ticketUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["ticketUrl"],
        message: "Agregá el link de venta, marcá sold out o marcá entrada libre.",
      });
    }
  });

export type ShowInput = z.input<typeof showInputSchema>;

export const galleryMetaSchema = z.object({
  id: z.string().trim().min(1),
  alt: z.string().trim().min(3, "Describí la imagen.").max(180),
  caption: z.string().trim().min(3, "Agregá un epígrafe.").max(220),
  scene: z.enum(["guitar", "band", "drummer", "vocalist"]),
  span: z.enum(["tall", "wide", "small"]),
  mono: z.boolean().optional().default(false),
});

export type GalleryMetaInput = z.input<typeof galleryMetaSchema>;

export const galleryUploadInitSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(1).max(120),
  size: z.number().int().positive().max(12 * 1024 * 1024),
});

export const galleryFinalizeSchema = z.object({
  path: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(3).max(180),
  caption: z.string().trim().min(3).max(220),
  scene: z.enum(["guitar", "band", "drummer", "vocalist"]),
  span: z.enum(["tall", "wide", "small"]),
  mono: z.boolean().optional().default(false),
});

export const epkSaveSchema = z.object({
  bioShort: z.string().trim().min(10, "Escribí una biografía corta.").max(500),
  bioText: z
    .string()
    .trim()
    .min(30, "La biografía es demasiado corta.")
    .max(12000),
  rider: z
    .array(
      z.object({
        item: z.string().trim().min(2).max(80),
        detail: z.string().trim().min(2).max(500),
      }),
    )
    .min(1, "El rider necesita al menos un ítem.")
    .max(24),
});

export type EpkSaveInput = z.input<typeof epkSaveSchema>;

export const epkUploadKindSchema = z.enum([
  "bio",
  "rider",
  "fotos",
  "demo",
  "stage-plot",
]);

export type EpkUploadKind = z.infer<typeof epkUploadKindSchema>;

export const epkUploadInitSchema = z.object({
  kind: epkUploadKindSchema,
  filename: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(1).max(120),
  size: z.number().int().positive().max(25 * 1024 * 1024),
});

export const epkFinalizeSchema = z.object({
  kind: epkUploadKindSchema,
  path: z.string().trim().min(1).max(500),
  size: z.number().int().positive(),
});
