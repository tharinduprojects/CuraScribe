'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, App } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

interface FloatingVoiceInputProps {
  onTranscript?: (text: string) => void;
  form?: any; // Ant Design form instance
}

export default function FloatingVoiceInput({ onTranscript, form }: FloatingVoiceInputProps) {
  const { message } = App.useApp();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  useEffect(() => {
    // Track focus changes to keep reference updated
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        activeElementRef.current = target;
        const inputElement = target as HTMLInputElement | HTMLTextAreaElement;
        selectionRef.current = {
          start: inputElement.selectionStart || 0,
          end: inputElement.selectionEnd || 0
        };
      }
    };

    // Track selection changes
    const handleSelectionChange = () => {
      const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElementRef.current = activeElement;
        selectionRef.current = {
          start: activeElement.selectionStart || 0,
          end: activeElement.selectionEnd || 0
        };
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('selectionchange', handleSelectionChange);

    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          insertTextIntoActiveField(transcript);

          if (onTranscript) {
            onTranscript(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          message.error(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [message, onTranscript]);

  const insertTextIntoActiveField = (text: string) => {
    const activeElement = activeElementRef.current as HTMLInputElement | HTMLTextAreaElement;

    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const start = selectionRef.current.start;
      const end = selectionRef.current.end;
      const currentValue = activeElement.value;

      // Insert text at cursor position or replace selection
      const newValue = currentValue.substring(0, start) +
        (start > 0 && currentValue[start - 1] !== ' ' ? ' ' : '') +
        text +
        (end < currentValue.length && currentValue[end] !== ' ' ? ' ' : '') +
        currentValue.substring(end);

      // Get the field name from various possible attributes
      let fieldName = activeElement.getAttribute('id') ||
        activeElement.getAttribute('name') ||
        activeElement.getAttribute('data-field');

      // For Ant Design, the id might be like "form_item_doctor_name" 
      // We need to extract just "doctor_name"
      if (fieldName) {
        // Remove common prefixes
        fieldName = fieldName.replace(/^form_item_/, '').replace(/^form_/, '');
      }

      if (form && fieldName) {
        // CRITICAL: Update form state FIRST before DOM
        form.setFieldsValue({ [fieldName]: newValue });

        // Force validate the field to ensure it's marked as touched
        form.validateFields([fieldName]).catch(() => { });

        // Wait a tick then update DOM to match form state
        setTimeout(() => {
          const updatedValue = form.getFieldValue(fieldName);
          if (activeElement.value !== updatedValue) {
            activeElement.value = updatedValue;
          }

          // Set cursor position after inserted text
          const newCursorPos = start + text.length + (start > 0 && currentValue[start - 1] !== ' ' ? 1 : 0);
          activeElement.setSelectionRange(newCursorPos, newCursorPos);
          activeElement.focus();

          // Update selection reference
          selectionRef.current = { start: newCursorPos, end: newCursorPos };
        }, 0);
      } else {
        // Fallback for non-Ant Design forms
        activeElement.value = newValue;

        // Trigger React's onChange by setting the value property
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;

        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        if (activeElement.tagName === 'INPUT' && nativeInputValueSetter) {
          nativeInputValueSetter.call(activeElement, newValue);
        } else if (activeElement.tagName === 'TEXTAREA' && nativeTextAreaValueSetter) {
          nativeTextAreaValueSetter.call(activeElement, newValue);
        }

        // Dispatch input and change events
        const inputEvent = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        activeElement.dispatchEvent(changeEvent);

        // Set cursor position after inserted text
        const newCursorPos = start + text.length + (start > 0 && currentValue[start - 1] !== ' ' ? 1 : 0);
        activeElement.setSelectionRange(newCursorPos, newCursorPos);
        activeElement.focus();

        // Update selection reference
        selectionRef.current = { start: newCursorPos, end: newCursorPos };
      }
    } else {
      message.warning('Please click on an input field first');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent the button from taking focus
    e.preventDefault();
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      message.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Check if we have a stored input field reference
      if (!activeElementRef.current ||
        (activeElementRef.current.tagName !== 'INPUT' && activeElementRef.current.tagName !== 'TEXTAREA')) {
        message.warning('Please click on an input field first');
        return;
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
        message.info('Listening... Speak now');
      } catch (error) {
        console.error('Error starting recognition:', error);
        message.error('Failed to start voice recognition');
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<AudioOutlined style={{ fontSize: '24px' }} />}
        onMouseDown={handleMouseDown}
        onClick={toggleListening}
        className={`
          !w-16 !h-16 shadow-lg transition-all duration-300
          ${isListening
            ? '!bg-red-500 hover:!bg-red-600 animate-pulse scale-110'
            : '!bg-indigo-600 hover:!bg-indigo-700'
          }
        `}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      />
      {isListening && (
        <div className="absolute -top-12 right-0 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
          Listening...
        </div>
      )}
    </div>
  );
}