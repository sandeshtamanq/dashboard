import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import GalleryForm from "../../../components/Gallery/GalleryForm";

export default function EditGallery() {
  const router = useRouter();
  const { id } = router.query;

  const [galleryDetails, setGalleryDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/gallery/${id}`).then((res) => {
        if (res) setGalleryDetails(res.data?.data);
        else router.push("/gallery");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <GalleryForm
        mode="edit"
        defaultValues={{
          title: galleryDetails?.title,
          link: galleryDetails?.link,
          images: galleryDetails?._images,
          description: galleryDetails?.description,
        }}
      />
    </>
  );
}
