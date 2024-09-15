import _ from "lodash";
import clsx from "clsx";
import { useRef, useState } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import TinySlider, { TinySliderElement } from "@/components/Base/TinySlider";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import Litepicker from "@/components/Base/Litepicker";
import ReportDonutChart from "@/components/ReportDonutChart";
import ReportLineChart from "@/components/ReportLineChart";
import ReportPieChart from "@/components/ReportPieChart";
import ReportDonutChart1 from "@/components/ReportDonutChart1";
import SimpleLineChart1 from "@/components/SimpleLineChart1";
import LeafletMap from "@/components/LeafletMap";
import { Menu } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import { useEffect} from "react";
import axios from "axios";

function Main() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [takeoffInProgressCount, setTakeoffInProgressCount] = useState(0);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients/clients"); // Adjust the endpoint as needed
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClients();
  }, []);


  

useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:3000/api/projects');
        const projectsData = projectsResponse.data.data;

        if (Array.isArray(projectsData)) {
          setProjects(projectsData);

          // Calculate the count of projects with adminStatus as "Takeoff In Progress"
          const takeoffInProgressCount = projectsData.filter(project => project.adminStatus === 'Takeoff In Progress').length;
          setTakeoffInProgressCount(takeoffInProgressCount);

          // Calculate the total number of projects
          const totalProjectsCount = projectsData.length;
          setTotalProjectsCount(totalProjectsCount);
        } else {
          console.error('Unexpected projects response format:', projectsResponse.data);
          setError('Unexpected projects response format');
        }
      } catch (err) {
        console.error('Projects API call error:', err);
        setError('Failed to fetch projects');
      }
    };

    const fetchClientsCount = async () => {
      try {
        const clientsResponse = await axios.get('http://localhost:3000/api/clients/clients');
        const clientsData = clientsResponse.data.clients;
        console.log(clientsResponse.data)

        if (Array.isArray(clientsData)) {
          setClientsCount(clientsData.length);
        } else {
          console.error('Unexpected clients response format:', clientsResponse.data);
          setError('Unexpected clients response format');
        }
      } catch (err) {
        console.error('Clients API call error:', err);
        setError('Failed to fetch clients');
      }
    };

    const fetchEmployeesCount = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3000/api/auth/users');
        const usersData = usersResponse.data;

        if (Array.isArray(usersData)) {
          const employeesCount = usersData.filter(user => user.role === 'employee').length;
          setEmployeesCount(employeesCount);
        } else {
          console.error('Unexpected users response format:', usersResponse.data);
          setError('Unexpected users response format');
        }
      } catch (err) {
        console.error('Users API call error:', err);
        setError('Failed to fetch users');
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchProjects(),
        fetchClientsCount(),
        fetchEmployeesCount()
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const [projectStatusCounts, setProjectStatusCounts] = useState({
    completed: 0,
    takeoffInProgress: 0,
    pending: 0,
    revision: 0,
    onHold: 0,
    pendingInProgress: 0,
  });
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    const fetchProjectStatuses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects');
        const projects = response.data.data;

        // Calculate the count for each status
        const statusCounts = {
          completed: 0,
          takeoffInProgress: 0,
          pending: 0,
          revision: 0,
          onHold: 0,
          pendingInProgress: 0,
        };

        projects.forEach(project => {
          switch (project.adminStatus) {
            case 'Completed':
              statusCounts.completed += 1;
              break;
            case 'Takeoff In Progress':
              statusCounts.takeoffInProgress += 1;
              break;
            case 'Pending':
              statusCounts.pending += 1;
              break;
            case 'Pending In Progress':
              statusCounts.pendingInProgress += 1;
              break;
            case 'On Hold':
              statusCounts.onHold += 1;
              break;
            case 'Revision':
              statusCounts.revision += 1;
              break;
            default:
              break;
          }
        });

        setProjectStatusCounts(statusCounts);
        setTotalProjects(projects.length);
      } catch (error) {
        console.error('Error fetching project statuses:', error);
      }
    };

    fetchProjectStatuses();
  }, []);

  // Helper function to calculate percentage
  const getPercentage = (count) => {
    return totalProjects === 0 ? 0 : ((count / totalProjects) * 100).toFixed(2);
  };
  const [salesReportFilter, setSalesReportFilter] = useState<string>();
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };


  const [currentMonthBudget, setCurrentMonthBudget] = useState(0);
  const [lastMonthBudget, setLastMonthBudget] = useState(0);
  const [totalBudgetByMonth, setTotalBudgetByMonth] = useState([]);

  // Helper function to get month/year from date
  const getMonthYear = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}-${d.getFullYear()}`;
  };
   useEffect(() => {
    const fetchProjectBudgets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects'); // Replace with actual endpoint
        const projects = response.data.data;

        const budgetByMonth = {};

        projects.forEach(project => {
          const monthYear = getMonthYear(project.createdAt); // Assuming `createdAt` field exists
          if (!budgetByMonth[monthYear]) {
            budgetByMonth[monthYear] = 0;
          }
          budgetByMonth[monthYear] += project.budget; // Assuming each project has a `budget` field
        });

        // Store budget data grouped by month
        setTotalBudgetByMonth(budgetByMonth);

        const currentMonth = getMonthYear(new Date());
        const lastMonth = getMonthYear(new Date(new Date().setMonth(new Date().getMonth() - 1)));

        setCurrentMonthBudget(budgetByMonth[currentMonth] || 0);
        setLastMonthBudget(budgetByMonth[lastMonth] || 0);
      } catch (error) {
        console.error('Error fetching project budgets:', error);
      }
    };

    fetchProjectBudgets();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                General Report
              </h2>
              <a href="" className="flex items-center ml-auto text-primary">
                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" /> Reload
                Data
              </a>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="FileText"
                        className="w-[28px] h-[28px] text-primary"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="33% Higher than last month"
                        >
                          33%
                          <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {takeoffInProgressCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Running Projects
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="FilePlus"
                        className="w-[28px] h-[28px] text-pending"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="2% Lower than last month"
                        >
                          2%
                          <Lucide
                            icon="ChevronDown"
                            className="w-4 h-4 ml-0.5"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {clientsCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      No of Clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Layers"
                        className="w-[28px] h-[28px] text-warning"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="12% Higher than last month"
                        >
                          12%{" "}
                          <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {totalProjectsCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Projects
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-success"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="22% Higher than last month"
                        >
                          22%{" "}
                          <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {employeesCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Employees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}
          {/* BEGIN: Sales Report */}
          
          {/* END: Sales Report */}
          {/* BEGIN: Weekly Top Seller */}
          <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-12">
      <div className="flex items-center h-10 intro-y">
        <h2 className="mr-5 text-lg font-medium truncate">
          Projects Status
        </h2>
      </div>
      <div className="p-5 mt-5 intro-y box">
        <div className="mt-3">
          <ReportPieChart height={213} /> {/* Assuming you already have a pie chart component */}
        </div>
        <div className="mx-auto mt-8 w-52 sm:w-auto">
          <div className="flex items-center">
            <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
            <span className="truncate">Completed</span>
            <span className="ml-auto font-medium">{getPercentage(projectStatusCounts.completed)}%</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
            <span className="truncate">Takeoff In Progress</span>
            <span className="ml-auto font-medium">{getPercentage(projectStatusCounts.takeoffInProgress)}%</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
            <span className="truncate">Pending</span>
            <span className="ml-auto font-medium">{getPercentage(projectStatusCounts.pending)}%</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
            <span className="truncate">Pending In Progress</span>
            <span className="ml-auto font-medium">{getPercentage(projectStatusCounts.pendingInProgress)}%</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-2 h-2 mr-3 rounded-full bg-danger"></div>
            <span className="truncate">On Hold</span>
            <span className="ml-auto font-medium">{getPercentage(projectStatusCounts.onHold)}%</span>
          </div>
          
        </div>
      </div>
    </div>
{/* END: Weekly Top Seller */}
{/* BEGIN: Our Clients */}
<div className="col-span-12 mt-6 xl:col-span-12">
  <div className="items-center block h-10 intro-y sm:flex">
    <h2 className="mr-5 text-lg font-medium truncate">
      Our Clients
    </h2>
    <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
      <Lucide
        icon="MapPin"
        className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3"
      />
      <FormInput
        type="text"
        className="pl-10 sm:w-56 !box"
        placeholder="Filter by city"
      />
    </div>
  </div>
  <div className="p-5 mt-12 intro-y box sm:mt-5">
    <div>
      250 Official stores in 21 countries, click the marker to see
      location details.
    </div>
    <LeafletMap className="h-[310px] mt-5 rounded-md bg-slate-200" />
  </div>
</div>
{/* END: Our Clients */}

          {/* BEGIN: Weekly Top Products */}
          <div className="col-span-12 mt-6">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">
                Weekly Top Projects
              </h2>
              <div className="flex items-center mt-3 sm:ml-auto sm:mt-0">
                
              </div>
            </div>
            <div className="mt-8 overflow-auto intro-y lg:overflow-visible sm:mt-0">
              <Table className="border-spacing-y-[10px] border-separate sm:mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      IMAGES
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      PRODUCT NAME
                    </Table.Th>
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      STOCK
                    </Table.Th>
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      STATUS
                    </Table.Th>
                    <Table.Th className="text-center border-b-0 whitespace-nowrap">
                      ACTIONS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {_.take(fakerData, 4).map((faker, fakerKey) => (
                    <Table.Tr key={fakerKey} className="intro-x">
                      <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                        <div className="flex">
                          <div className="w-10 h-10 image-fit zoom-in">
                            <Tippy
                              as="img"
                              alt="Midone Tailwind HTML Admin Template"
                              className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                              src={faker.images[0]}
                              content={`Uploaded at ${faker.dates[0]}`}
                            />
                          </div>
                          <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                            <Tippy
                              as="img"
                              alt="Midone Tailwind HTML Admin Template"
                              className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                              src={faker.images[1]}
                              content={`Uploaded at ${faker.dates[1]}`}
                            />
                          </div>
                          <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                            <Tippy
                              as="img"
                              alt="Midone Tailwind HTML Admin Template"
                              className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                              src={faker.images[2]}
                              content={`Uploaded at ${faker.dates[2]}`}
                            />
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                        <a href="" className="font-medium whitespace-nowrap">
                          {faker.products[0].name}
                        </a>
                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {faker.products[0].category}
                        </div>
                      </Table.Td>
                      <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                        {faker.stocks[0]}
                      </Table.Td>
                      <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                        <div
                          className={clsx([
                            "flex items-center justify-center",
                            { "text-success": faker.trueFalse[0] },
                            { "text-danger": !faker.trueFalse[0] },
                          ])}
                        >
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                          {faker.trueFalse[0] ? "Active" : "Inactive"}
                        </div>
                      </Table.Td>
                      <Table.Td
                        className={clsx([
                          "box w-56 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600",
                          "before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 before:dark:bg-darkmode-400",
                        ])}
                      >
                        <div className="flex items-center justify-center">
                          <a className="flex items-center mr-3" href="">
                            <Lucide
                              icon="CheckSquare"
                              className="w-4 h-4 mr-1"
                            />
                            Edit
                          </a>
                          <a className="flex items-center text-danger" href="">
                            <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                            Delete
                          </a>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
            <div className="flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap">
              <Pagination className="w-full sm:w-auto sm:mr-auto">
                <Pagination.Link>
                  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                </Pagination.Link>
                <Pagination.Link>
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </Pagination.Link>
                <Pagination.Link>...</Pagination.Link>
                <Pagination.Link>1</Pagination.Link>
                <Pagination.Link active>2</Pagination.Link>
                <Pagination.Link>3</Pagination.Link>
                <Pagination.Link>...</Pagination.Link>
                <Pagination.Link>
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Pagination.Link>
                <Pagination.Link>
                  <Lucide icon="ChevronsRight" className="w-4 h-4" />
                </Pagination.Link>
              </Pagination>
              <FormSelect className="w-20 mt-3 !box sm:mt-0">
                <option>10</option>
                <option>25</option>
                <option>35</option>
                <option>50</option>
              </FormSelect>
            </div>
          </div>
          {/* END: Weekly Top Products */}
        </div>
      </div>
      <div className="col-span-12 2xl:col-span-3">
        <div className="pb-10 -mb-10 2xl:border-l">
          <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
            {/* BEGIN: Transactions */}
            <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
      <div className="flex items-center h-10 intro-x">
        <h2 className="mr-5 text-lg font-medium truncate">Clients</h2>
      </div>
      <div className="mt-5">
        {clients.slice(0, 5).map((client, index) => (
          <div key={index} className="intro-x">
            <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
              <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                <img
                  alt="Client Avatar"
                  src={client.avatar || "default-avatar.png"}  // Add a default image if needed
                />
              </div>
              <div className="ml-4 mr-auto">
                <div className="font-medium">{client.name}</div>  {/* Display client name */}
                <div className="text-slate-500 text-xs mt-0.5">
                  {new Date(client.createdAt).toLocaleDateString()}  {/* Display creation date */}
                </div>
              </div>
              <div className={clsx({
                  "text-success": client.isActive,
                  "text-danger": !client.isActive,
              })}>
               
              </div>
            </div>
          </div>
        ))}
        <a
          href="/clients"
          className="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
        >
          View More
        </a>
      </div>
    </div>
            {/* END: Transactions */}
           
           
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
