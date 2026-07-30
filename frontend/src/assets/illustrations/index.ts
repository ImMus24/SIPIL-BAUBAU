// Hero
export { HeroIllustration } from './hero/HeroIllustration';

// Auth
export { LoginIllustration } from './auth/LoginIllustration';
export { RegisterIllustration } from './auth/RegisterIllustration';
export { ForgotPasswordIllustration } from './auth/ForgotPasswordIllustration';
export { ResetPasswordIllustration } from './auth/ResetPasswordIllustration';
export { EmailVerificationIllustration } from './auth/EmailVerificationIllustration';
export { SecureAccessIllustration } from './auth/SecureAccessIllustration';

// Empty States
export { NoReports } from './states/empty/NoReports';
export { NoNotifications } from './states/empty/NoNotifications';
export { NoSearchResults } from './states/empty/NoSearchResults';
export { NoTasks } from './states/empty/NoTasks';
export { NoData } from './states/empty/NoData';
export { NoInternet } from './states/empty/NoInternet';
export { NoAssignments } from './states/empty/NoAssignments';
export { NoHistory } from './states/empty/NoHistory';
export { NoMessages } from './states/empty/NoMessages';

// Error States
export { Error404 } from './states/error/Error404';
export { Error403 } from './states/error/Error403';
export { Error401 } from './states/error/Error401';
export { Error500 } from './states/error/Error500';
export { Maintenance } from './states/error/Maintenance';
export { Offline } from './states/error/Offline';
export { ConnectionError } from './states/error/ConnectionError';
export { UploadFailed } from './states/error/UploadFailed';
export { PermissionDenied } from './states/error/PermissionDenied';

// Success States
export { ComplaintSubmitted } from './states/success/ComplaintSubmitted';
export { ComplaintVerified } from './states/success/ComplaintVerified';
export { ComplaintCompleted } from './states/success/ComplaintCompleted';
export { ProfileUpdated } from './states/success/ProfileUpdated';
export { PasswordChanged } from './states/success/PasswordChanged';
export { DataSaved } from './states/success/DataSaved';
export { VerificationSuccess } from './states/success/VerificationSuccess';

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

// Dashboard Heroes
export { CitizenDashboardHero } from './dashboard/hero/DashboardHeroes';
export { OfficerDashboardHero } from './dashboard/hero/DashboardHeroes';
export { AdminDashboardHero } from './dashboard/hero/DashboardHeroes';
export { ExecutiveDashboardHero } from './dashboard/hero/DashboardHeroes';

// Onboarding
export { OnboardingComplaint } from './onboarding/OnboardingIllustrations';
export { OnboardingLocation } from './onboarding/OnboardingIllustrations';
export { OnboardingTrack } from './onboarding/OnboardingIllustrations';
export { OnboardingComplete } from './onboarding/OnboardingIllustrations';

// Features
export { InteractiveMapIllustration } from './feature/FeatureIllustrationsPart1';
export { GPSPinIllustration } from './feature/FeatureIllustrationsPart1';
export { FieldOfficerIllustration } from './feature/FeatureIllustrationsPart1';
export { GovernmentOfficeIllustration } from './feature/FeatureIllustrationsPart1';
export { CitizenFeedbackIllustration } from './feature/FeatureIllustrationsPart2';
export { ComplaintTimelineIllustration } from './feature/FeatureIllustrationsPart2';
export { NotificationCenterIllustration } from './feature/FeatureIllustrationsPart2';
export { ReportsIllustration } from './feature/FeatureIllustrationsPart2';

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
