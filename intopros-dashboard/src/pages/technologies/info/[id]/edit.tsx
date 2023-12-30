import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import TechnologyInfoForm from "../../../../components/Technologies/TechnologyInfoForm";
import { makeRequest } from "../../../../utils/api";

export default function EditTechnology() {
  const router = useRouter();
  const { id } = router.query;

  const [technologyDetails, setTechnologyDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/technologies/info/${id}`).then((res) => {
        if (res) setTechnologyDetails(res.data?.data);
        else router.push("/technologies/info");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TechnologyInfoForm
        mode="edit"
        defaultValues={{
          title: technologyDetails?.title,
          technologies: technologyDetails?.technologies,
          description: technologyDetails?.description,
          image: technologyDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${technologyDetails?.image}`
            : undefined,
        }}
      />
    </>
  );
}
