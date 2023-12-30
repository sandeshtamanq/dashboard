import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { makeRequest } from "../../../../utils/api";
import TrainingCategoryForm from "../../../../components/Training/TrainingCategoryForm";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [trainingCategory, setTrainingCategory] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/trainings/category/${id}`).then((res) => {
        if (res) setTrainingCategory(res.data?.data);
        else router.push("/trainings/categories");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TrainingCategoryForm
        mode="edit"
        defaultValues={{
          category: trainingCategory?.category,
        }}
      />
    </>
  );
}
