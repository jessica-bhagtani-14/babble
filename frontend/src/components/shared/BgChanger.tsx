// import { useEffect, useState } from "react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const backgrounds = [
//   { value: "Frame", preview: "/bg-frames/Frame.svg" },
//   { value: "Frame2", preview: "/bg-frames/Frame2.svg" },
//   { value: "Frame3", preview: "/bg-frames/Frame3.svg" },
//   { value: "Frame4", preview: "/bg-frames/Frame4.svg" },
//   { value: "Frame5", preview: "/bg-frames/Frame5.svg" },
//   { value: "Frame6", preview: "/bg-frames/Frame6.svg" },
//   { value: "Frame7", preview: "/bg-frames/Frame7.svg" },
//   { value: "Frame8", preview: "/bg-frames/Frame8.svg" },
//   { value: "Frame9", preview: "/bg-frames/Frame9.svg" },
//   { value: "Frame10", preview: "/bg-frames/Frame11.svg" },
// ];

// export const BgChanger = () => {
//   const [backgroundImage, setBackgroundImage] = useState(
//     "/bg-frames/Frame10.svg"
//   );
//   const [isBgLoaded, setIsBgLoaded] = useState(true);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem("chat-bg");
//     if (saved) {
//       setBackgroundImage(saved);
//     }
//   }, []);

//   // Handle background change with lazy loading and transition
//   const handleBackgroundChange = (value: string) => {
//     const selected = backgrounds.find((bg) => bg.value === value);
//     if (!selected) return;

//     const img = new Image();
//     img.src = selected.preview;

//     setIsBgLoaded(false); // Hide while loading

//     img.onload = () => {
//       setBackgroundImage(selected.preview);
//       localStorage.setItem("chat-bg", selected.preview);
//       setIsBgLoaded(true); // Fade-in when loaded
//     };
//   };

//   return (
//     <>
//       <div
//         className={`absolute inset-0 z-[-1] max-w-3xl mx-auto transition-opacity duration-700 ease-in-out ${
//           isBgLoaded ? "opacity-40 dark:opacity-90" : "opacity-0"
//         }`}
//         style={{
//           backgroundImage: `url('${backgroundImage}')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           // backgroundAttachment: "fixed",
//         }}
//       />
//       <div className="flex justify-end max-w-7xl mx-auto px-4 pt-4 z-10 relative">
//         <Select onValueChange={handleBackgroundChange}>
//           <SelectTrigger className="w-[220px]">
//             <SelectValue placeholder="Change Background" />
//           </SelectTrigger>
//           <SelectContent>
//             {backgrounds.map((bg) => (
//               <SelectItem key={bg.value} value={bg.value}>
//                 <div className="flex items-center gap-2">
//                   <img
//                     src={bg.preview}
//                     loading="lazy"
//                     alt={bg.value}
//                     className="w-20 h-12 rounded-sm object-cover border"
//                   />
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </>
//   );
// };

// import { useBgStore } from "@/state/bgStore";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { Button } from "../ui/button";

// const backgrounds = [
//   { value: "Frame", preview: "/bg-frames/Frame.svg" },
//   { value: "Frame2", preview: "/bg-frames/Frame2.svg" },
//   { value: "Frame3", preview: "/bg-frames/Frame3.svg" },
//   { value: "Frame4", preview: "/bg-frames/Frame4.svg" },
//   { value: "Frame5", preview: "/bg-frames/Frame5.svg" },
//   { value: "Frame6", preview: "/bg-frames/Frame6.svg" },
//   { value: "Frame7", preview: "/bg-frames/Frame7.svg" },
//   { value: "Frame8", preview: "/bg-frames/Frame8.svg" },
//   { value: "Frame9", preview: "/bg-frames/Frame9.svg" },
//   { value: "Frame10", preview: "/bg-frames/Frame10.svg" },
//   { value: "Frame11", preview: "/bg-frames/Frame11.svg" },
// ];

// export const BgChanger = () => {
//   const { backgroundImage, isBgLoaded, setBackgroundImage, setIsBgLoaded } =
//     useBgStore();

//   const handleBackgroundChange = (value: string) => {
//     const selected = backgrounds.find((bg) => bg.value === value);
//     if (!selected) return;

//     const img = new Image();
//     img.src = selected.preview;

//     setIsBgLoaded(false); // Fade out

//     img.onload = () => {
//       setBackgroundImage(selected.preview);
//       setIsBgLoaded(true); // Fade in
//     };
//   };

//   return (
//     <>
//       <div className="flex justify-end max-w-7xl mx-auto px-4 pt-4 z-10 relative">
//         <Dialog  onValueChange={handleBackgroundChange}>
//           <DialogTrigger>
//             <span>Change Background</span>
//           </DialogTrigger>
//           <DialogContent >
//             <DialogTitle>Backgrounds</DialogTitle>
//             <DialogDescription>
//               Set a background image for your app.
//             </DialogDescription>
//             <div className="grid grid-cols-3 gap-y-2">

//             {backgrounds.map((bg) => (
//               <Button
//               variant="ghost"
//               className="flex items-center gap-2 w-full h-full"
//               key={bg.value}
//                 value={bg.value}
//                 >
//                 <img
//                   src={bg.preview}
//                   loading="lazy"
//                   alt={bg.value}
//                   className="w-32 h-20 rounded-sm object-cover border"
//                   />
//               </Button>
//             ))}
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// };

// import { useBgStore } from "@/state/bgStore";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { useState } from "react";

// const backgrounds = [
//   { value: "Frame", preview: "/bg-frames/Frame.svg" },
//   { value: "Frame2", preview: "/bg-frames/Frame2.svg" },
//   { value: "Frame3", preview: "/bg-frames/Frame3.svg" },
//   { value: "Frame4", preview: "/bg-frames/Frame4.svg" },
//   { value: "Frame5", preview: "/bg-frames/Frame5.svg" },
//   { value: "Frame6", preview: "/bg-frames/Frame6.svg" },
//   { value: "Frame7", preview: "/bg-frames/Frame7.svg" },
//   { value: "Frame8", preview: "/bg-frames/Frame8.svg" },
//   { value: "Frame9", preview: "/bg-frames/Frame9.svg" },
//   { value: "Frame10", preview: "/bg-frames/Frame10.svg" },
//   { value: "Frame11", preview: "/bg-frames/Frame11.svg" },
// ];

// export const BgChanger = () => {
//   const [open, setOpen] = useState(false);
//   const { setBackgroundImage, setIsBgLoaded } = useBgStore();

//   const handleBackgroundChange = (preview: string) => {
//     const img = new Image();
//     img.src = preview;

//     setIsBgLoaded(false); // fade out

//     img.onload = () => {
//       setBackgroundImage(preview);
//       setIsBgLoaded(true); // fade in
//       setOpen(false);
//     };
//   };

//   return (
//     <div className="flex justify-end max-w-7xl mx-auto px-4 z-10 relative">
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button variant="ghost">Change Background</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogTitle>Backgrounds</DialogTitle>
//           <DialogDescription>
//             Set a background image for your chat
//           </DialogDescription>
//           <div className="grid grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto">
//             {backgrounds.map((bg) => (
//               <Button
//                 key={bg.value}
//                 variant="ghost"
//                 onClick={() => handleBackgroundChange(bg.preview)}
//                 className="flex items-center justify-center w-full h-full p-1"
//               >
//                 <img
//                   src={bg.preview}
//                   alt={bg.value}
//                   loading="lazy"
//                   className="w-32 h-20 object-cover rounded border"
//                 />
//               </Button>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };







import { useBgStore } from "@/state/bgStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

const backgrounds = [
  { value: "Frame", preview: "/bg-frames/Frame.svg" },
  { value: "Frame2", preview: "/bg-frames/Frame2.svg" },
  { value: "Frame3", preview: "/bg-frames/Frame3.svg" },
  { value: "Frame4", preview: "/bg-frames/Frame4.svg" },
  { value: "Frame5", preview: "/bg-frames/Frame5.svg" },
  { value: "Frame6", preview: "/bg-frames/Frame6.svg" },
  { value: "Frame7", preview: "/bg-frames/Frame7.svg" },
  { value: "Frame8", preview: "/bg-frames/Frame8.svg" },
  { value: "Frame9", preview: "/bg-frames/Frame9.svg" },
  { value: "Frame10", preview: "/bg-frames/Frame10.svg" },
  { value: "Frame11", preview: "/bg-frames/Frame11.svg" },
];

export const BgChanger = () => {
  const [open, setOpen] = useState(false);
  const { backgroundImage, setBackgroundImage, setIsBgLoaded } = useBgStore();

  // On mount, load from localStorage (if not already in store)
  useEffect(() => {
    const saved = localStorage.getItem("chat-bg");
    if (saved) {
      setBackgroundImage(saved);
    }
  }, [setBackgroundImage]);

  const handleBackgroundChange = (preview: string) => {
    const img = new Image();
    img.src = preview;

    setIsBgLoaded(false);

    img.onload = () => {
      setBackgroundImage(preview);
      localStorage.setItem("chat-bg", preview); // Persist selection
      setIsBgLoaded(true);
      setOpen(false);
    };
  };

  return (
    <div className="flex justify-end max-w-7xl mx-auto px-4 z-10 relative">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="p-1">
            <img
              src={backgroundImage}
              alt="Current Background"
              className="w-10 h-8 rounded object-cover border"
            />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Backgrounds</DialogTitle>
          <DialogDescription>
            Set a background image for your chat
          </DialogDescription>
          <div className="grid grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto">
            {backgrounds.map((bg) => (
              <Button
                key={bg.value}
                variant="ghost"
                onClick={() => handleBackgroundChange(bg.preview)}
                className="flex items-center justify-center w-full h-full p-1"
              >
                <img
                  src={bg.preview}
                  alt={bg.value}
                  loading="lazy"
                  className="w-32 h-20 object-cover rounded border"
                />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

