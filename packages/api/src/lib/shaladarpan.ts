export async function getSchoolDetailsByNicCode(nicCode: string) {
  const result = await fetch(
    'https://rajshaladarpan.rajasthan.gov.in/SD2/Home/Public2/CitizenCorner/schoolprofile.aspx/Getdatabyschool',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: `{schoolcode:"${nicCode}"}`,
    },
  ).then((res) => res.json())
  const rawDetails = JSON.parse(result.d) as ResultData
  return {
    nicCode: rawDetails.SCHCD,
    schoolName: rawDetails.SchoolName,
    hmName: rawDetails.HM_Name,
  }
}

type ResultData = {
  SCHCD: string
  SchoolName: string
  District: string
  Block: string
  Division: string
  Village: string
  Panchayat: string
  AssemblyName: string
  LokSabhaName: string
  Rural_Urban: string
  Department: string
  Low_Class: string
  High_Class: string
  HM_Name: string
  HM_Mobile: string | null
  HM_Email: string
  PEEO_Name: string
  SchoolCategory: string
  SchoolManagement: string
  IS_Vocational: string
  Is_Utkristh: string
  Aadarsh_Group: string
  ICT_PHASE: string
  IS_TSP_old: string
  IS_TSP_new: string
  TSPArea: string
  Is_AadarshSchool: string
  kgbv: string
  Is_ModelSchool: string
  Is_MGGS: string
  DISE_CODE: string
  Is_Calp: string
  pincode: string
  StreamId: string
  SubjectId: string
  IS_PEEO: string
  SchoolTypeID: string
  Is_Sanskrit: string
  isResidentialSchool: string
  isHostel: string
  isCWSN: string
  isComputerLab: string
  isPlayGround: string
  locality: string
  schSubList: {
    streamname: string
    subjectname: string
  }[]
}
