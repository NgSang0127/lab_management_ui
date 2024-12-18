
import LogDashboard from './Chart/LogDashboard.tsx';
import LogTable from './Chart/LogTable.tsx';
import BarChart from "./Chart/BarChart.tsx";

const DashboardContent = () => {
    return (
        <div className="container mx-auto px-3 py-10">
            <div className="mb-8">
                <LogDashboard />
            </div>
            <div className="mb-8">
                <BarChart/>
            </div>
            <div>
                <LogTable />
            </div>
        </div>
    );
};

export default DashboardContent;
