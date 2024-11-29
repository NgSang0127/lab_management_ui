import {Link} from "react-router-dom";
import MultiItemCarousel from "./MultiItemCarousel.tsx";
import Footer from "./Footer.tsx";



const Home = () => {
    return (
        <div>
            <section className='lg:py:10'>
                <MultiItemCarousel/>
            </section>
            <nav className="px-2 py-5">
                <ul className="space-y-4">
                    <li>
                        <Link to="admin/hcmiu/timetable/import">Import Timetable</Link>
                    </li>
                    <li>
                        <Link to="timetable/by-week">Get timetable By week</Link>
                    </li>
                    <li>
                        <Link to="admin/hcmiu/timetable/cancel">Cancel Timetable</Link>
                    </li>
                    <li>
                        <Link to="admin/hcmiu/timetable/create">Create Timetable</Link>
                    </li>

                </ul>
            </nav>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
            <Footer/>
        </div>

    )
};

export default Home;
