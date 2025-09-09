<template>
    <div class="modal fade" id="overallResignationReportModal" tabindex="-1"
        aria-labelledby="overallResignationReportModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="overallResignationReportModalLabel">Overall Resignation Report</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div v-if="pdfUrl" class="pdf-container">
                        <iframe :src="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
                    </div>
                    <div v-else class="text-center text-muted py-4">
                        No PDF available to display.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
    name: 'OverallResignationReportModal',
    props: {
        pdfUrl: String
    },
    mounted() {
        const modalElement = document.getElementById('overallResignationReportModal');
        if (modalElement) {
            this.modalInstance = new Modal(modalElement);
        }
    },
    methods: {
        openModal() {
            if (this.modalInstance) {
                this.modalInstance.show();
            } else {
                const modalElement = document.getElementById('overallResignationReportModal');
                if (modalElement) {
                    this.modalInstance = new Modal(modalElement);
                    this.modalInstance.show();
                }
            }
        },
        closeModal() {
            if (this.modalInstance) {
                this.modalInstance.hide();
            }
        }
    }
};
</script>

<style scoped>
.modal-content {
    padding: 10px;
}

.pdf-container {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
