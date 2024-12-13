function GalleryCard({ img }: { img: string }) {
  return (
    <>
      <img src={img} alt="galleryImg" height="100%" width="100%" />
    </>
  );
}

export default GalleryCard;
