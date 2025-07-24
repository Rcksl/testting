<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">ICABay - AI Health Assistant</h2>
      <BaseButton variant="ghost" @click="$router.push('/patient')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Chat Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Chat Messages -->
      <div class="lg:col-span-3">
        <BaseCard class="h-96 flex flex-col">
          <!-- Chat Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Bot class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">ICABay</h3>
                <p class="text-sm text-green-600">Online</p>
              </div>
            </div>
            <BaseButton variant="ghost" size="sm" @click="clearChat">
              <Trash2 class="h-4 w-4" />
            </BaseButton>
          </div>

          <!-- Messages Area -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-if="messages.length === 0" class="text-center py-8">
              <Bot class="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 mb-2">Hello! I'm ICABay, your AI health assistant.</p>
              <p class="text-sm text-gray-400">Ask me about symptoms, health conditions, or general medical questions.</p>
            </div>
            
            <div v-for="message in messages" :key="message.id" 
                 :class="[
                   'flex',
                   message.sender === 'user' ? 'justify-end' : 'justify-start'
                 ]">
              <div :class="[
                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                message.sender === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              ]">
                <p class="text-sm">{{ message.text }}</p>
                <p :class="[
                  'text-xs mt-1',
                  message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                ]">
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-4 border-t border-gray-200">
            <form @submit.prevent="sendMessage" class="flex space-x-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Type your health question here..."
                class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
                :disabled="isTyping"
              />
              <BaseButton type="submit" :disabled="!newMessage.trim() || isTyping">
                <Send class="h-4 w-4" />
              </BaseButton>
            </form>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Questions -->
        <BaseCard header="Quick Questions">
          <div class="space-y-2">
            <button
              v-for="question in quickQuestions"
              :key="question"
              @click="askQuickQuestion(question)"
              class="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              :disabled="isTyping"
            >
              {{ question }}
            </button>
          </div>
        </BaseCard>

        <!-- Health Tips -->
        <BaseCard header="Daily Health Tips">
          <div class="space-y-3">
            <div v-for="tip in healthTips" :key="tip.id" class="p-3 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-900">{{ tip.title }}</h4>
              <p class="text-xs text-blue-700 mt-1">{{ tip.content }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- Disclaimer -->
        <BaseCard header="Important Notice">
          <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-start space-x-2">
              <AlertTriangle class="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs text-yellow-800">
                  <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only. 
                  Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Bot, Send, Trash2, AlertTriangle } from 'lucide-vue-next';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement>();

const quickQuestions = [
  "What are the symptoms of flu?",
  "How to manage stress?",
  "When should I see a doctor?",
  "What is a healthy diet?",
  "How much water should I drink daily?",
  "What are signs of dehydration?"
];

const healthTips = [
  {
    id: 1,
    title: "Stay Hydrated",
    content: "Drink at least 8 glasses of water daily to maintain proper hydration."
  },
  {
    id: 2,
    title: "Regular Exercise",
    content: "Aim for 30 minutes of moderate exercise most days of the week."
  },
  {
    id: 3,
    title: "Quality Sleep",
    content: "Get 7-9 hours of quality sleep each night for optimal health."
  }
];

// Mock AI responses
const aiResponses: Record<string, string> = {
  "flu": "Common flu symptoms include fever, cough, sore throat, runny nose, body aches, headache, and fatigue. If symptoms persist or worsen, please consult a healthcare provider.",
  "stress": "To manage stress, try deep breathing exercises, regular physical activity, adequate sleep, healthy eating, and consider meditation or yoga. If stress becomes overwhelming, seek professional help.",
  "doctor": "You should see a doctor if you have persistent symptoms, severe pain, high fever, difficulty breathing, chest pain, or any concerning changes in your health.",
  "diet": "A healthy diet includes plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, sugar, and excessive salt.",
  "water": "Most adults should drink about 8 glasses (64 ounces) of water daily, but this can vary based on activity level, climate, and individual needs.",
  "dehydration": "Signs of dehydration include thirst, dry mouth, less frequent urination, dark-colored urine, fatigue, dizziness, and confusion."
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    text: newMessage.value,
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  const question = newMessage.value.toLowerCase();
  newMessage.value = '';

  await scrollToBottom();

  // Simulate AI typing
  isTyping.value = true;
  
  setTimeout(async () => {
    isTyping.value = false;
    
    // Generate AI response
    let response = "I understand your question. While I can provide general health information, I recommend consulting with a healthcare professional for personalized medical advice.";
    
    // Check for keywords in the question
    for (const [keyword, answer] of Object.entries(aiResponses)) {
      if (question.includes(keyword)) {
        response = answer;
        break;
      }
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: response,
      timestamp: new Date()
    };

    messages.value.push(botMessage);
    await scrollToBottom();
  }, 1500);
};

const askQuickQuestion = (question: string) => {
  newMessage.value = question;
  sendMessage();
};

const clearChat = () => {
  if (confirm('Are you sure you want to clear the chat history?')) {
    messages.value = [];
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>