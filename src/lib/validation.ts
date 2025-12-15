// Form validation utilities

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateWorkerProfile = (data: {
  name: string;
  headline: string;
  country: string;
  skills: string[];
  hourlyRateMin: string;
  hourlyRateMax: string;
  availabilityHours: string;
  bio: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.headline || data.headline.trim().length < 10) {
    errors.headline = 'Headline must be at least 10 characters';
  }

  if (!data.country) {
    errors.country = 'Please select a country';
  }

  if (data.skills.length === 0) {
    errors.skills = 'Please add at least one skill';
  }

  const minRate = parseFloat(data.hourlyRateMin);
  const maxRate = parseFloat(data.hourlyRateMax);

  if (isNaN(minRate) || minRate < 0) {
    errors.hourlyRateMin = 'Please enter a valid minimum rate';
  }

  if (isNaN(maxRate) || maxRate < 0) {
    errors.hourlyRateMax = 'Please enter a valid maximum rate';
  }

  if (minRate >= maxRate) {
    errors.hourlyRateMax = 'Maximum rate must be higher than minimum rate';
  }

  const hours = parseInt(data.availabilityHours);
  if (isNaN(hours) || hours < 1 || hours > 12) {
    errors.availabilityHours = 'Hours must be between 1 and 12';
  }

  if (!data.bio || data.bio.trim().length < 50) {
    errors.bio = 'Bio must be at least 50 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateEmployerProfile = (data: {
  companyName: string;
  country: string;
  bio: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = 'Company name must be at least 2 characters';
  }

  if (!data.country) {
    errors.country = 'Please select a country';
  }

  if (!data.bio || data.bio.trim().length < 20) {
    errors.bio = 'Bio must be at least 20 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateJob = (data: {
  title: string;
  description: string;
  skills: string[];
  hourlyRateMin: string;
  hourlyRateMax: string;
  availabilityHours: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 10) {
    errors.title = 'Title must be at least 10 characters';
  }

  if (!data.description || data.description.trim().length < 50) {
    errors.description = 'Description must be at least 50 characters';
  }

  if (data.skills.length === 0) {
    errors.skills = 'Please add at least one required skill';
  }

  if (data.hourlyRateMin) {
    const minRate = parseFloat(data.hourlyRateMin);
    if (isNaN(minRate) || minRate < 0) {
      errors.hourlyRateMin = 'Please enter a valid minimum rate';
    }
  }

  if (data.hourlyRateMax) {
    const maxRate = parseFloat(data.hourlyRateMax);
    if (isNaN(maxRate) || maxRate < 0) {
      errors.hourlyRateMax = 'Please enter a valid maximum rate';
    }
  }

  if (data.hourlyRateMin && data.hourlyRateMax) {
    const minRate = parseFloat(data.hourlyRateMin);
    const maxRate = parseFloat(data.hourlyRateMax);
    if (minRate >= maxRate) {
      errors.hourlyRateMax = 'Maximum rate must be higher than minimum rate';
    }
  }

  if (data.availabilityHours) {
    const hours = parseInt(data.availabilityHours);
    if (isNaN(hours) || hours < 1 || hours > 12) {
      errors.availabilityHours = 'Hours must be between 1 and 12';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateMessage = (content: string): { valid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (content.trim().length > 2000) {
    return { valid: false, error: 'Message cannot exceed 2000 characters' };
  }

  return { valid: true };
};
