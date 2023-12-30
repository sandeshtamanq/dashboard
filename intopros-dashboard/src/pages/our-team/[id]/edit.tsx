import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import TeamForm from "../../../components/Our Team/TeamForm";

export default function EditTeam() {
  const router = useRouter();
  const { id } = router.query;

  const [teamDetails, setTeamDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/our-team/${id}`).then((res) => {
        if (res) setTeamDetails(res.data?.data);
        else router.push("/our-team");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TeamForm
        mode="edit"
        defaultValues={{
          name: teamDetails?.name,
          designation: teamDetails?.designation,
          linkedin: teamDetails?.linkedin,
          image: teamDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${teamDetails?.image}`
            : undefined,
        }}
      />
    </>
  );
}
