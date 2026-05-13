import Image from "next/image";

interface TrailHeroProps {
  image: string;
  alt: string;
}

export default function TrailHero({ image, alt }: TrailHeroProps) {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
