import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import CmsForm from "../../../components/Cms/CmsForm";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [cmsDetails, setCmsDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/cms/${id}`).then((res) => {
        if (res) setCmsDetails(res.data?.data);
        else router.push("/cms");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <CmsForm
        mode="edit"
        defaultValues={{
          title: cmsDetails?.title,
          description: cmsDetails?.description,
          metaDescription: cmsDetails?.metaDescription,
          image: cmsDetails?.image,
          children: cmsDetails?.childPages,
        }}
      />
    </>
  );
}
