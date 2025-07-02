import { Card } from "@/components/ui/card"; // Menggunakan Card dari ShadCN UI
import { ClipboardList, Users, ThumbsUp, ThumbsDown } from "lucide-react";

const Dashboard = async () => {
  const { lowonganCount, pelamarCount, diterimaCount, ditolakCount } = {
    lowonganCount: 0,
    pelamarCount: 0,
    diterimaCount: 0,
    ditolakCount: 0,
  };

  return (
    <div className="bg-background p-6 text-foreground">
      <h1 className="text-2xl font-semibold text-foreground">
        King's Recruitment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Lowongan Card */}
        <Card className="bg-card p-6 shadow-md flex justify-between items-center text-foreground">
          <div className="flex items-center space-x-2">
            <ClipboardList className="mr-2 text-foreground" />
            <span className="text-lg">Lowongan</span>
          </div>
          <div className="text-2xl font-bold">{lowonganCount}</div>
        </Card>

        {/* Pelamar Card */}
        <Card className="bg-card p-6 shadow-md flex justify-between items-center text-foreground">
          <div className="flex items-center space-x-2">
            <Users className="mr-2 text-foreground" />
            <span className="text-lg">Pelamar</span>
          </div>
          <div className="text-2xl font-bold">{pelamarCount}</div>
        </Card>

        {/* Diterima Card */}
        <Card className="bg-card p-6 shadow-md flex justify-between items-center text-foreground">
          <div className="flex items-center space-x-2">
            <ThumbsUp className="mr-2 text-foreground" />
            <span className="text-lg">Diterima</span>
          </div>
          <div className="text-2xl font-bold">{diterimaCount}</div>
        </Card>

        {/* Ditolak Card */}
        <Card className="bg-card p-6 shadow-md flex justify-between items-center text-foreground">
          <div className="flex items-center space-x-2">
            <ThumbsDown className="mr-2 text-foreground" />
            <span className="text-lg">Di Tolak</span>
          </div>
          <div className="text-2xl font-bold">{ditolakCount}</div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
