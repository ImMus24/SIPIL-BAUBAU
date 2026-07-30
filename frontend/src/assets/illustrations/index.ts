// Hero
export { HeroIllustration } from './hero/HeroIllustration';

// Auth
export { LoginIllustration } from './auth/LoginIllustration';
export { RegisterIllustration } from './auth/RegisterIllustration';

// Empty States
export { NoReports } from './states/empty/NoReports';
export { NoNotifications } from './states/empty/NoNotifications';
export { NoSearchResults } from './states/empty/NoSearchResults';
export { NoTasks } from './states/empty/NoTasks';
export { NoData } from './states/empty/NoData';
export { NoInternet } from './states/empty/NoInternet';
export { NoAssignments } from './states/empty/NoAssignments';
export { NoHistory } from './states/empty/NoHistory';

// Error States
export { Error404 } from './states/error/Error404';
export { Error403 } from './states/error/Error403';
export { Error401 } from './states/error/Error401';
export { Error500 } from './states/error/Error500';
export { Maintenance } from './states/error/Maintenance';
export { Offline } from './states/error/Offline';

// Success States
export { ComplaintSubmitted } from './states/success/ComplaintSubmitted';
export { ComplaintVerified } from './states/success/ComplaintVerified';
export { ComplaintCompleted } from './states/success/ComplaintCompleted';
export { ProfileUpdated } from './states/success/ProfileUpdated';
export { PasswordChanged } from './states/success/PasswordChanged';

// Officer Dashboard
export { RoadInspection } from './dashboard/officer/RoadInspection';
export { RepairProcess } from './dashboard/officer/RepairProcess';
export { NavigationOfficer } from './dashboard/officer/NavigationOfficer';
export { Maintenance as MaintenanceOfficer } from './dashboard/officer/Maintenance';
export { TaskCompletion } from './dashboard/officer/TaskCompletion';

// Admin Dashboard
export { Analytics } from './dashboard/admin/Analytics';
export { Verification } from './dashboard/admin/Verification';
export { InfrastructureMonitoring } from './dashboard/admin/InfrastructureMonitoring';
export { DigitalWorkflow } from './dashboard/admin/DigitalWorkflow';

// Executive Dashboard
export { CityOverview } from './dashboard/executive/CityOverview';
export { Heatmap } from './dashboard/executive/Heatmap';
export { Performance } from './dashboard/executive/Performance';

// Micro
export { TipIllustration } from './micro/TipIllustration';
export { HelpIllustration } from './micro/HelpIllustration';
export { TooltipIllustration } from './micro/TooltipIllustration';

// Backgrounds
export { GridPattern } from './backgrounds/GridPattern';
export { MapContour } from './backgrounds/MapContour';
export { AbstractShapes } from './backgrounds/AbstractShapes';

// Types & Theme
export type { IllustrationProps, IllustrationSize, ThemeVariant } from './types';
export { IllustrationTheme, useIllustrationVariant } from './IllustrationTheme';
