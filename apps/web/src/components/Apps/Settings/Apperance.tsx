import { background as Constant_Background, theme as Constant_Theme } from '@/constants/settings';
import { changeBackground, changeTheme } from '@/redux/features/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import cn from '@/utils';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Apperance = () => {
    const dispatch = useAppDispatch();
    // const [blurValue, setBlurValue] = useState<number>(0);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const background = useAppSelector((state) => state.settings.apperance.background);

    useEffect(() => {
        document.body.style.backgroundImage = `url(${background?.src})`;
        document.body.style.backgroundRepeat = "no-repeat";
        localStorage.setItem("settings", JSON.stringify({ theme, background }));
    }, [background]);

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify({ theme, background }));

    }, [theme])

    return (
        <div className='flex flex-col gap-4'>
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}

            >
                <h3 className="font-medium">Color</h3>
                <div className="flex flex-wrap gap-3 shadow bg-white/60 backdrop-blur px-3 py-4 rounded-md">
                    {Constant_Theme.map((bg) => (
                        <button
                            key={bg.id}
                            onClick={() => dispatch(changeTheme(bg))}
                            className={cn(
                                "w-8 h-8 shadow-md rounded-full outline-sky-500 transition-all",
                                bg.color,
                                theme?.id === bg.id ? "ring-2 ring-sky-500 scale-110" : " hover:scale-105"
                            )}
                        />
                    ))}
                </div>
            </motion.div>
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="font-medium">Background</h3>
                <div className="flex flex-wrap gap-4 shadow bg-white/60 backdrop-blur px-4 py-4 rounded-md">
                    {Constant_Background.map((bg) => (
                        <button
                            key={bg.id}
                            onClick={() => dispatch(changeBackground(bg))}
                            className={cn(
                                " w-32 overflow-hidden shadow-md rounded-md outline-sky-500 transition-all",
                                background?.id === bg.id ? "ring-2 p-0.5 ring-sky-500 scale-110" : " hover:scale-105"
                            )}
                        >
                            <img className='aspect-video object-fill rounded-md' src={bg.src} alt={bg.id} />

                        </button>
                    ))}
                </div>
                {/* <div className="flex flex-col items-center gap-2 w-1/2">
                    <label className="text-lg font-semibold">Blur Background: {blurValue}px</label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        value={blurValue}
                        onChange={(e) => setBlurValue(Number(e.target.value))}
                        className="w-full cursor-pointer"
                    />
                </div> */}
            </motion.div>
        </div>
    )
}

export default Apperance