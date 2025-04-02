<template>
  <QuestionContainer
    :data="data"
    :is-correct="userState.isCorrect"
    :is-graded="isGraded"
    :is-submitted="isSubmitted"
    allowed-retake
    @retry="isSubmitted = false"
    @submit="submit"
  >
    <div class="text-subtitle-2 mb-2">Select all that apply:</div>
    <VInput
      :model-value="selectedAnswer"
      :rules="[requiredRule]"
      hide-details="auto"
      validate-on="submit"
    >
      <VItemGroup
        v-model="selectedAnswer"
        class="w-100 d-flex flex-column ga-2"
        selected-class="bg-blue-grey-lighten-5"
        multiple
      >
        <VItem
          v-for="(item, index) in data.answers"
          :key="index"
          v-slot="{ toggle, isSelected, selectedClass }"
          :value="index"
        >
          <VCard
            :class="selectedClass"
            :disabled="isSubmitted"
            class="d-flex align-center px-4 py-3"
            border
            flat
            rounded
            @click="toggle"
          >
            <VAvatar
              :class="{ 'font-weight-bold': isSelected }"
              :variant="isSelected ? 'flat' : 'outlined'"
              class="mr-4"
              color="blue-grey-darken-2"
              rounded="lg"
              size="small"
            >
              {{ indexToAlpha(index) }}
            </VAvatar>
            {{ item }}
            <VSpacer />
            <template v-if="isSubmitted && isGraded">
              <VIcon
                v-if="isSelected"
                :color="isCorrect(index) ? 'success' : 'error'"
                :icon="`mdi-${isCorrect(index) ? 'check' : 'close'}-circle`"
              />
            </template>
          </VCard>
        </VItem>
      </VItemGroup>
    </VInput>
  </QuestionContainer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElementData } from '@tailor-cms/ce-multiple-choice-manifest';
import { QuestionContainer } from '@tailor-cms/lx-components';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const isSubmitted = ref(!!props.userState.isSubmitted);
const selectedAnswer = ref<string[]>(props.userState.response ?? []);

const isGraded = computed(() => 'isCorrect' in props.userState);

const indexToAlpha = (index: number) => String.fromCharCode(index + 65);
const isCorrect = (index: number) => props.userState.correct?.includes(index);
const submit = () => emit('interaction', { response: selectedAnswer.value });

const requiredRule = (val: number[]) => {
  return !!val.length || 'You have to select an answer';
};

watch(
  () => props.userState,
  (state = {}) => {
    selectedAnswer.value = state.response || [];
    isSubmitted.value = !!state.isSubmitted;
  },
  { deep: true },
);
</script>
