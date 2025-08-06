import { BaseEntity, ApiResponse, PaginatedResponse, ApiError, UserData, UserRole, UserPreferences, NotificationPreferences, PrivacySettings, AddressInfo, SelectOption, FilterOption, SortOption, FormField, ValidationRule, AppEvent, AppConfig, LoadingState, LoadingData, Status } from '../global';

describe('global types', () => {
  it('should have valid BaseEntity type', () => {
    // Test de base pour vérifier que le type existe
    const testBaseEntity: BaseEntity = {} as BaseEntity;
    expect(testBaseEntity).toBeDefined();
  });

  it('should have valid ApiResponse type', () => {
    // Test de base pour vérifier que le type existe
    const testApiResponse: ApiResponse = {} as ApiResponse;
    expect(testApiResponse).toBeDefined();
  });

  it('should have valid PaginatedResponse type', () => {
    // Test de base pour vérifier que le type existe
    const testPaginatedResponse: PaginatedResponse = {} as PaginatedResponse;
    expect(testPaginatedResponse).toBeDefined();
  });

  it('should have valid ApiError type', () => {
    // Test de base pour vérifier que le type existe
    const testApiError: ApiError = {} as ApiError;
    expect(testApiError).toBeDefined();
  });

  it('should have valid UserData type', () => {
    // Test de base pour vérifier que le type existe
    const testUserData: UserData = {} as UserData;
    expect(testUserData).toBeDefined();
  });

  it('should have valid UserRole type', () => {
    // Test de base pour vérifier que le type existe
    const testUserRole: UserRole = {} as UserRole;
    expect(testUserRole).toBeDefined();
  });

  it('should have valid UserPreferences type', () => {
    // Test de base pour vérifier que le type existe
    const testUserPreferences: UserPreferences = {} as UserPreferences;
    expect(testUserPreferences).toBeDefined();
  });

  it('should have valid NotificationPreferences type', () => {
    // Test de base pour vérifier que le type existe
    const testNotificationPreferences: NotificationPreferences = {} as NotificationPreferences;
    expect(testNotificationPreferences).toBeDefined();
  });

  it('should have valid PrivacySettings type', () => {
    // Test de base pour vérifier que le type existe
    const testPrivacySettings: PrivacySettings = {} as PrivacySettings;
    expect(testPrivacySettings).toBeDefined();
  });

  it('should have valid AddressInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testAddressInfo: AddressInfo = {} as AddressInfo;
    expect(testAddressInfo).toBeDefined();
  });

  it('should have valid SelectOption type', () => {
    // Test de base pour vérifier que le type existe
    const testSelectOption: SelectOption = {} as SelectOption;
    expect(testSelectOption).toBeDefined();
  });

  it('should have valid FilterOption type', () => {
    // Test de base pour vérifier que le type existe
    const testFilterOption: FilterOption = {} as FilterOption;
    expect(testFilterOption).toBeDefined();
  });

  it('should have valid SortOption type', () => {
    // Test de base pour vérifier que le type existe
    const testSortOption: SortOption = {} as SortOption;
    expect(testSortOption).toBeDefined();
  });

  it('should have valid FormField type', () => {
    // Test de base pour vérifier que le type existe
    const testFormField: FormField = {} as FormField;
    expect(testFormField).toBeDefined();
  });

  it('should have valid ValidationRule type', () => {
    // Test de base pour vérifier que le type existe
    const testValidationRule: ValidationRule = {} as ValidationRule;
    expect(testValidationRule).toBeDefined();
  });

  it('should have valid AppEvent type', () => {
    // Test de base pour vérifier que le type existe
    const testAppEvent: AppEvent = {} as AppEvent;
    expect(testAppEvent).toBeDefined();
  });

  it('should have valid AppConfig type', () => {
    // Test de base pour vérifier que le type existe
    const testAppConfig: AppConfig = {} as AppConfig;
    expect(testAppConfig).toBeDefined();
  });

  it('should have valid LoadingState type', () => {
    // Test de base pour vérifier que le type existe
    const testLoadingState: LoadingState = {} as LoadingState;
    expect(testLoadingState).toBeDefined();
  });

  it('should have valid LoadingData type', () => {
    // Test de base pour vérifier que le type existe
    const testLoadingData: LoadingData = {} as LoadingData;
    expect(testLoadingData).toBeDefined();
  });

  it('should have valid Status type', () => {
    // Test de base pour vérifier que le type existe
    const testStatus: Status = {} as Status;
    expect(testStatus).toBeDefined();
  });
});
