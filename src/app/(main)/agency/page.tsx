import { getAuthUserDetails, verifyAndAcceptsInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AgencyPage = async () => {
  /* const authUser = await currentUser();

  if (!authUser) {
    return redirect("/sign-in");
  } */

  const agencyId = await verifyAndAcceptsInvitation()
  console.log(agencyId)

  // get users details 
  const user = await getAuthUserDetails();



  return (
    <div>
      <h1>Agency Page</h1>
    </div>
  )
}

export default AgencyPage;