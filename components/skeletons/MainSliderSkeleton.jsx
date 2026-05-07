import Skeleton from "./Skeleton";
import "@/styles/client/skeletons/main-slider-skeleton.css";

export default function MainSliderSkeleton() {
  return (
    <div className="main-slider-skeleton">
      {/* Background */}
      <Skeleton className="slider-bg element" />

      {/* Content */}
      <div className="content">
        <Skeleton className="title element text" />
        <Skeleton className="description element text" />
      </div>
    </div>
  );
}