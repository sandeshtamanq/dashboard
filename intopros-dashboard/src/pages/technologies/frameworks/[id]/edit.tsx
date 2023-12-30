import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../../utils/api";
import TechnologyFrameworkForm from "../../../../components/Technologies/TechnologyFrameworkForm";

export default function EditTechnology() {
  const router = useRouter();
  const { id } = router.query;

  const [technologyDetails, setTechnologyDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/technologies/frameworks/${id}`).then((res) => {
        if (res) setTechnologyDetails(res.data?.data);
        else router.push("/technologies/frameworks");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TechnologyFrameworkForm
        mode="edit"
        defaultValues={{
          title: technologyDetails?.title,
          description: technologyDetails?.description,
          technology: technologyDetails?.technology,
          belongsTo: technologyDetails?.belongsTo,
          image: technologyDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${technologyDetails?.image}`
            : undefined,
        }}
      />
    </>
  );
}
