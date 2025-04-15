function GalleryCard({ img }: { img: string }) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg">
      <img
        src={img}
        alt="galleryImg"
        height="100%"
        className="bg-center object-cover"
        width="100%"
      />
    </div>
  );
}

export default GalleryCard;
