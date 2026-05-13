import Carousel from "@/components/Carousel";
import { routes } from "@/data/routes";

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden">
      <Carousel routes={routes} />
    </main>
  );
}
