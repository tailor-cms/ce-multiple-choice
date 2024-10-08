<template>
  <VForm
    ref="form"
    class="tce-container"
    validate-on="submit"
    @submit.prevent="save"
  >
    <VTextarea
      v-model="elementData.question"
      :readonly="isDisabled"
      :rules="[requiredRule]"
      class="my-3"
      label="Question"
      rows="3"
      auto-grow
    />
    <div class="text-subtitle-2 mb-2">Select correct answers</div>
    <VInput
      :model-value="!!elementData.correct.length"
      :rules="[(val: any) => val || 'Please choose the correct answers']"
    >
      <div class="d-flex flex-column w-100">
        <VSlideYTransition group>
          <VTextField
            v-for="(answer, index) in elementData.answers"
            :key="index"
            :model-value="answer"
            :readonly="isDisabled"
            :rules="[requiredRule]"
            class="my-2"
            placeholder="Answer..."
            @update:model-value="updateAnswer(index, $event)"
          >
            <template #prepend>
              <VCheckbox
                v-model="elementData.correct"
                :readonly="isDisabled"
                :rules="[requiredRule]"
                :validation-value="!!elementData.correct.length"
                :value="index"
                color="primary"
                hide-details
                multiple
              />
            </template>
            <template #append>
              <VBtn
                v-if="!isDisabled && answersCount > 2"
                aria-label="Remove answer"
                density="comfortable"
                icon="mdi-close"
                variant="text"
                @click="removeAnswer(index)"
              />
            </template>
          </VTextField>
        </VSlideYTransition>
      </div>
    </VInput>
    <div class="d-flex justify-center align-center mb-2">
      <VBtn
        v-if="!isDisabled"
        prepend-icon="mdi-plus"
        variant="text"
        rounded
        @click="addAnswer"
      >
        Add Answer
      </VBtn>
    </div>
    <div v-if="!isDisabled" class="d-flex justify-end">
      <VBtn :disabled="isDirty" variant="text" @click="cancel">Cancel</VBtn>
      <VBtn :disabled="isDirty" class="ml-2" type="submit" variant="tonal">
        Save
      </VBtn>
    </div>
  </VForm>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';
import { Element, ElementData } from '@tailor-cms/ce-multiple-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const emit = defineEmits(['save']);
const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
}>();

const form = ref<HTMLFormElement>();
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.answers.length);
const isDirty = computed(() => isEqual(elementData, props.element.data));

const addAnswer = () => elementData.answers.push('');
const removeAnswer = (answerIndex: number) => {
  elementData.answers.splice(answerIndex, 1);
  const index = elementData.correct.indexOf(answerIndex);
  if (index !== -1) elementData.correct.splice(index, 1);
  elementData.correct.forEach((it, i) => {
    if (it >= answerIndex) elementData.correct[i] = it - 1;
  });
};
const updateAnswer = (index: number, value: string) =>
  (elementData.answers[index] = value);

const save = async () => {
  const { valid } = await form.value?.validate();
  if (valid) emit('save', elementData);
};

const cancel = () => {
  Object.assign(elementData, cloneDeep(props.element.data));
  form.value?.resetValidation();
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'The field is required';
};

watch(
  () => props.element.data,
  (data) => Object.assign(elementData, cloneDeep(data)),
);
</script>

<style lang="scss" scoped>
.tce-container {
  text-align: left;
}
</style>
