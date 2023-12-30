import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../../utils/api";
import TechnologyHiringMenuForm from "../../../../components/Technologies/TechnologyHiringMenuForm";

export default function EditTechnology() {
  const router = useRouter();
  const { id } = router.query;

  const [technologyDetails, setTechnologyDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/technologies/hiring-menu/${id}`).then((res) => {
        if (res) setTechnologyDetails(res.data?.data);
        else router.push("/technologies/hiring-menu");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TechnologyHiringMenuForm
        mode="edit"
        defaultValues={{
          title: technologyDetails?.title,
          description: technologyDetails?.description,
          working: technologyDetails?.working,
          communication: technologyDetails?.communication,
          billing: technologyDetails?.billing
                }}
      />
    </>
  );
}
