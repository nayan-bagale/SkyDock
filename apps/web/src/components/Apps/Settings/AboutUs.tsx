import { GITHUB_LINK, LINKEDIN_LINK, TWITTER_LINK } from '@/constants/links';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from "lucide-react";

const AboutUs = () => {
    return (
        <div className=" flex flex-col items-center justify-center w-full h-full">
            <motion.img
                src="skydock-logo-resized.png" alt="Logo" className=" h-28"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}
            />
            <div className="flex flex-col items-center justify-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 w-96 text-center text-sm"><span className="font-bold text-gray-800">SkyDock</span> is a privacy-first web OS to access your files, apps, and media in one secure, high-performance workspace — anytime, anywhere.</motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 justify-center mt-4">
                    <a href={GITHUB_LINK} target='_blank' className="p-1 text-decoration-none text-inherit hover:bg-gray-200 rounded-full transition-all duration-200 ease-in-out">
                        <Github className=" h-5 w-5" />
                    </a>
                    <a href={TWITTER_LINK} target='_blank' className="p-1 text-decoration-none text-inherit hover:bg-gray-200 rounded-full transition-all duration-200 ease-in-out">
                        <Twitter className="h-5 w-5" />
                    </a>
                    <a href={LINKEDIN_LINK} target='_blank' className="p-1 text-decoration-none text-inherit hover:bg-gray-200 rounded-full transition-all duration-200 ease-in-out">
                        <Linkedin className="h-5 w-5" />
                    </a>
                </motion.div>
            </div>
        </div>
    )
}

export default AboutUs