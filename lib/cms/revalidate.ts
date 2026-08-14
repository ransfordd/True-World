import { revalidatePath } from "next/cache";

export function revalidateCmsPublic() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/faq");
  revalidatePath("/testimonials");
  revalidatePath("/resources");
  revalidatePath("/coaching");
  revalidatePath("/journey");
  revalidatePath("/get-in-touch");
  revalidatePath("/contact");
  revalidatePath("/articles");
}
