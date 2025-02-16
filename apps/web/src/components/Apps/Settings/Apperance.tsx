import { theme as Constant_Theme } from '@/constants/settings';
import { changeTheme } from '@/redux/features/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import cn from '@/utils';

const Apperance = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.settings.apperance.theme)
    return (
        <div className='flex flex-col gap-4'>
            <div className="space-y-2">
                <h3 className="font-medium">Color</h3>
                <div className="flex flex-wrap gap-3 bg-white/60 backdrop-blur px-3 py-4 rounded-md">
                    {Constant_Theme.map((bg) => (
                        <button
                            key={bg.id}
                            onClick={() => dispatch(changeTheme(bg))}
                            className={cn(
                                "w-8 h-8 shadow-md rounded-full outline-sky-500 transition-all",
                                bg.color,
                                theme.id === bg.id ? "ring-2 ring-sky-500 scale-110" : " hover:scale-105"
                            )}
                        />
                    ))}
                </div>
            </div>
            {/* <div className="space-y-2">
                <h3 className="font-medium">Background</h3>
                <div className="flex flex-wrap gap-3 bg-white/60 backdrop-blur px-3 py-4 rounded-md">
                    {Constant_Theme.map((bg) => (
                        <button
                            key={bg.id}
                            onClick={() => dispatch(changeTheme(bg))}
                            className={cn(
                                "w-10 h-10 shadow-md rounded-full outline-sky-500 transition-all",
                                bg.color,
                                theme.id === bg.id ? "ring-2 ring-sky-500 scale-110" : " hover:scale-105"
                            )}
                        />
                    ))}
                </div>
            </div> */}
        </div>
    )
}

export default Apperance