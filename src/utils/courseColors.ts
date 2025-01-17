export const courseColors = [
    'bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100',
    'bg-pink-100', 'bg-indigo-100', 'bg-orange-100', 'bg-teal-100', 'bg-gray-100',
    'bg-lime-100', 'bg-cyan-100', 'bg-amber-100', 'bg-violet-100', 'bg-rose-100',
    'bg-fuchsia-100', 'bg-emerald-100', 'bg-sky-100', 'bg-indigo-200', 'bg-amber-200'
];
export const getCourseColor = (() => {
    const courseColorMap = new Map<string, string>();

    const hashStringToNumber = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    return (courseName: string | undefined, timetableName: string): string => {
        const key = courseName || timetableName;
        if (courseColorMap.has(key)) {
            return courseColorMap.get(key)!;
        }
        const color = courseColors[hashStringToNumber(key) % courseColors.length];
        courseColorMap.set(key, color);
        return color;
    };
})();