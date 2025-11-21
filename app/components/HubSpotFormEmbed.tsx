'use client';

import { useHubspotForm } from 'next-hubspot';

interface HubSpotFormEmbedProps {
  formId: string;
  portalId?: string;
  onFormSubmitted?: () => void;
}

export default function HubSpotFormEmbed({
  formId,
  portalId = '6314272',
  onFormSubmitted,
}: HubSpotFormEmbedProps) {
  const { isFormCreated, isError, error } = useHubspotForm({
    portalId: portalId,
    formId: formId,
    target: '#hubspot-form-wrapper',
    onFormReady: ($form) => {
      console.log('HubSpot form is ready', $form);
    },
    onFormSubmit: ($form, formValues) => {
      console.log('HubSpot form is being submitted (before data sent)', { $form, formValues });
      // Don't prevent submission - let it continue
    },
    onFormSubmitted: (submitMessage, params) => {
      console.log('HubSpot form submitted and data sent to HubSpot', { submitMessage, params });
      // This fires AFTER the data is actually sent to HubSpot
      // Trigger CSV download after successful submission
      if (onFormSubmitted) {
        onFormSubmitted();
      }
    },
    onFormError: (errorCode, _, values) => {
      console.error('HubSpot form submission error', { errorCode, values });
    },
  });

  return (
    <div className="min-h-[400px] w-full">
      {!isFormCreated && !isError && (
        <div className="flex items-center justify-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400">Loading form...</p>
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-600 dark:text-red-400">
            Failed to load form. {error?.message || 'Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      <div
        id="hubspot-form-wrapper"
        className="hubspot-form-container w-full"
        style={{ minHeight: '400px' }}
      ></div>
    </div>
  );
}
