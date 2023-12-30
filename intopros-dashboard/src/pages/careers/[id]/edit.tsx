import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CareerForm from "../../../components/Career/CareerForm";
import { makeRequest } from "../../../utils/api";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [careerDetails, setCareerDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/careers/${id}`).then((res) => {
        if (res) setCareerDetails(res.data?.data);
        else router.push("/careers");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <CareerForm
        mode="edit"
        defaultValues={{
          title: careerDetails?.title,
          category: careerDetails?.category,
          description: careerDetails?.description,
          tags: careerDetails?._tags,
          image: careerDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${careerDetails?.image}`
            : undefined,
          publishedDate: careerDetails?.publishedDate,
          metaDescription: careerDetails?.metaDescription,
        }}
      />
    </>
  );
}
