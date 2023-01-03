<script>
	import { i18n } from './../stores/i18n.js';
	import { StacksEditor } from '@stackoverflow/stacks-editor';
    import "@stackoverflow/stacks-editor/dist/styles.css";
    // include the Stacks js and css as they're not included in the bundle
    import "@stackoverflow/stacks";
    import "@stackoverflow/stacks/dist/css/stacks.css";
    import { onMount } from "svelte";
    import { authStore } from "../stores/common.js";
    import QuestionTag from "./QuestionTag.svelte";
    import { vscodeProgress } from '../helpers/vscode-api.helper';
    import Loader from '../common/Loader.svelte';
    import axios from "axios";

    let stacksEditor;

    let title = "";
    let questionTags = [];
    let questionTagValue = "";
    let isLoading = false;

    onMount(()=> {
        stacksEditor = new StacksEditor(
            document.querySelector("#editor-container"),
            "",
            {}
        );
    })

    function remove(tagName) {
        questionTags = [...questionTags.filter(tag => tagName!=tag)];
    }


    function addQuestionTag(event) {
        if (event.keyCode === 13) {
            questionTagValue = ""
            questionTags.push(event.target.value);
            questionTags = [...questionTags]
        }
    }


    function handleAskQuestion() {
        vscodeProgress("start", "Loading Search Results", false);
        isLoading = true;

        const tags = questionTags.map(tag => {
            return {
                text : tag
            }
        });

        const authToken = $authStore;
        const qaboxUrl = "http://localhost:8088/api/common/post-question";
        const requestBody = {
            title,
            text: stacksEditor.content,
            tags
        };
        var headers = {
            withCredentials: true,
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxpbHZuYWlyIiwiZ2l2ZW5fbmFtZSI6IlNhbGlsIiwiZmFtaWx5X25hbWUiOiJOYWlyIiwiaWF0IjoxNTE2MjM5MDIyfQ.AOj7Dccg1qmTZ7MxIJBaCWH7w7su-0SkPYSBPnsg9FA`,
            },
        };

        axios
        .post(qaboxUrl, requestBody, headers)
        .then((response) => {
            isLoading = false;
            console.log(response)
            if (response.status === 200) {
                let responseBody = response.data;
                console.log(responseBody);
                vscodeProgress("stop", null, false);
            } else {
                vscodeProgress("stop", null, true);
            }
        })
        .catch(() => {
            isLoading = false;
            vscodeProgress("stop", null, true);
        });


    }


</script>

{#if isLoading}
  <Loader />
{/if}

<div style="margin:50px;padding:20px .theme-dark__forced">
    <div
        class="flex--item w70 lg:w100 bg-white bar-sm p24 ba bc-black-075 fl-shrink0 js-post-title-section"
        id="post-title"
    >
        <div class="d-flex gs4 gsy fd-column js-stacks-validation">
            <div class="d-flex fd-column flex--item">
                <div class="flex--item">
                    <label for="title" class="s-label"> Title </label>
                </div>
                <div class="d-flex flex--item md:fd-column">
                    <div class="s-description flex--item9 my2">
                        <label for="title">
                            Be specific and imagine you're asking a question to
                            another person.
                        </label>
                    </div>
                    <div
                        class="flex--item3 s-input-message js-title-text-counter ta-right md:ta-left my2 s-description py2 cool"
                    />
                </div>
            </div>
            <div class="d-flex ps-relative">
                <input
                    id="title"
                    name="title"
                    type="text"
                    maxlength="300"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    class="s-input js-post-title-field ask-title-field"
                    bind:value={title}
                    data-min-length="15"
                    data-max-length="150"
                />
                <svg
                    aria-hidden="true"
                    class="s-input-icon js-title-invalid-alert d-none svg-icon iconAlertCircle"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    ><path
                        d="M9 17c-4.36 0-8-3.64-8-8 0-4.36 3.64-8 8-8 4.36 0 8 3.64 8 8 0 4.36-3.64 8-8 8ZM8 4v6h2V4H8Zm0 8v2h2v-2H8Z"
                    /></svg
                >
            </div>
            <div
                class="flex--item s-input-message d-none js-stacks-validation-message"
            />
        </div>
    </div>

    <div
        class="flex--item bg-white bar-sm ba bc-black-075 w70 lg:w100 fl-shrink0"
        id="post-problem-details"
    >
        <div class="js-problem-details-overlay t0 b0 p24">
            <div class="d-flex gs4 gsy fd-column js-stacks-validation">
                <div class="flex--item">
                    <label for="problem-details" class="d-block s-label">
                        What are the details of your problem?
                        <p class="s-description mt2 mb6">
                            Introduce the problem and expand on what you put in
                            the title. Minimum 20 characters.
                        </p>
                    </label>
                </div>
                <div class="js-problem-details-field" id="problem-details">
                    <div id="editor-container" />
                    
                </div>
            </div>
        </div>
    </div>
    <div
        class="flex--item w70 lg:w100 bg-white bar-sm p24 ba bc-black-075 fl-shrink0 js-post-title-section"
        id="post-title"
    >
        <div class="d-flex gs4 gsy fd-column js-stacks-validation">
            <div class="d-flex fd-column flex--item">
                <div class="flex--item">
                    <label for="title" class="s-label"> Tags </label>
                </div>
                <div class="d-flex flex--item md:fd-column">
                    <div class="s-description flex--item9 my2">
                        <label for="title">
                            Add the relevant tags for your questions.
                        </label>
                    </div>
                    <div
                        class="flex--item3 s-input-message js-title-text-counter ta-right md:ta-left my2 s-description py2 cool"
                    />
                </div>
            </div>
            <div style="margin-bottom:10px">
                {#each questionTags as questionTag(questionTag)}
                    <QuestionTag tageName={questionTag} removeQuestionTag={(tag) => remove(tag)}/>                    
                {/each}          
            </div>
            <div class="d-flex ps-relative">
                <input
                    id="title"
                    name="title"
                    type="text"
                    maxlength="300"
                    placeholder="e.g. React, Java"
                    class="s-input js-post-title-field ask-title-field"
                    bind:value={questionTagValue}
                    data-min-length="15"
                    data-max-length="150"
                    on:keydown={addQuestionTag}
                />
                <svg
                    aria-hidden="true"
                    class="s-input-icon js-title-invalid-alert d-none svg-icon iconAlertCircle"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    ><path
                        d="M9 17c-4.36 0-8-3.64-8-8 0-4.36 3.64-8 8-8 4.36 0 8 3.64 8 8 0 4.36-3.64 8-8 8ZM8 4v6h2V4H8Zm0 8v2h2v-2H8Z"
                    /></svg
                >
            </div>
            <div
                class="flex--item s-input-message d-none js-stacks-validation-message"
            />
        </div>
    </div>
    <div>
        <button
            class="s-btn s-btn__primary mt12 js-next-problem-details js-next-buttons"
            on:click={handleAskQuestion}
            type="button">Post your question</button
        >
    </div>
</div>