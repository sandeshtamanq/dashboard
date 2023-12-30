import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import WorkForm from "../../../components/Works/WorkForm";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [workDetails, setWorkDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/works/${id}`).then((res) => {
        if (res) setWorkDetails(res.data?.data);
        else router.push("/works");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <WorkForm
        mode="edit"
        defaultValues={{
          title: workDetails?.title,
          tags: workDetails?.tags,
          serviceTypes: workDetails?.serviceTypes,
          goTo: workDetails?.goTo,
          category: workDetails?.category,
          shortDescription: workDetails?.shortDescription,
          description: workDetails?.description,
          logo: workDetails?.logo
            ? `${process.env.NEXT_PUBLIC_API_URL}${workDetails?.logo}`
            : undefined,
          banner: workDetails?.banner
            ? `${process.env.NEXT_PUBLIC_API_URL}${workDetails?.banner}`
            : undefined,
        }}
      />
    </>
  );
}
