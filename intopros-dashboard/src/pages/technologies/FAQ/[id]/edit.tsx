import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../../utils/api";
import TechnologyFAQForm from "../../../../components/Technologies/TechnologyFAQForm";

export default function EditFAQ() {
  const router = useRouter();
  const { id } = router.query;

  const [technologyFAQDetails, setTechnologyFAQDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/technologies/faq/${id}`).then((res) => {
        if (res) setTechnologyFAQDetails(res.data?.data);
        else router.push("/technologies/FAQ");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TechnologyFAQForm
        mode="edit"
        defaultValues={{
          question: technologyFAQDetails?.question,
          answer: technologyFAQDetails?.answer,
          technology: technologyFAQDetails?.technology,
          belongsTo: technologyFAQDetails?.belongsTo
        }}
      />
    </>
  );
}
