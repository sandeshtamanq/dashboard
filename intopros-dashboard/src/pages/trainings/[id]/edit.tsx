import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import TrainingForm from "../../../components/Training/TrainingForm";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [trainingDetails, setTrainingDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/trainings/${id}`).then((res) => {
        if (res) setTrainingDetails(res.data?.data);
        else router.push("/trainings");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TrainingForm
        mode="edit"
        defaultValues={{
          title: trainingDetails?.title,
          category: trainingDetails?.category,
          description: trainingDetails?.description,
          tags: trainingDetails?._tags,
          image: trainingDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${trainingDetails?.image}`
            : undefined,
          publishedDate: trainingDetails?.publishedDate,
          metaDescription: trainingDetails?.metaDescription,
        }}
      />
    </>
  );
}
