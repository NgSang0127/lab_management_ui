import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import logoIT from "@images/logo2.png";
import Divider from "@mui/material/Divider";


const Footer = () => {


    return (
        <footer className="bg-gray-900 text-white relative">
            <div className="container mx-auto py-5 px-4 lg:px-20 flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">

                {/* Left Section - Contact Info */}
                <div className="text-center md:text-left w-full md:w-1/2">
                    <h2 className="font-semibold text-xl">Trường Đại học Quốc Tế - Đại học Quốc gia TP.HCM</h2>
                    <p className="mt-2">Địa chỉ: Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</p>
                    <p>Điện thoại: (028) 37244270</p>
                    <p>Fax: (028) 37244271</p>
                    <p>Email: <a href="mailto:info@hcmiu.edu.vn" className="text-blue-400 hover:underline">info@hcmiu.edu.vn</a></p>
                </div>

                {/* Center Section - Social Media Links */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/IUVNUHCMC" target="_blank" rel="noopener noreferrer">
                            <FacebookIcon fontSize="large" className="text-blue-500 hover:text-blue-400 transition duration-200" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCTBixlLRDIIlpmR_Y7wmI3w" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon fontSize="large" className="text-red-500 hover:text-red-400 transition duration-200" />
                        </a>
                        <a href="https://www.instagram.com/iuvnu.hcmc/" target="_blank" rel="noopener noreferrer">
                            <InstagramIcon fontSize="large" className="text-pink-500 hover:text-pink-400 transition duration-200" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <Divider variant="middle" className="bg-gray-600" />

            {/* Bottom Section - Logo and Copyright */}
            <div className="container mx-auto px-4 lg:px-20 flex justify-between items-center py-5">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <img src={logoIT} alt="Logo Trường Đại học Quốc Tế" className="w-80 h-auto" />
                </div>

                {/* Copyright */}
                <div className="text-gray-400 text-sm text-right">
                    <p>Copyright © 2024 School of Computer Science and Engineering</p>
                    <p>Designed by NCS</p>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
