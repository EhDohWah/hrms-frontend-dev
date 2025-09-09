<template>
    <div class="modal fade" id="overallIndividualLeaveReportModal" tabindex="-1"
        aria-labelledby="overallIndividualLeaveReportModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="overallIndividualLeaveReportModalLabel">Individual Leave Request Summary
                        Report</h5>
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
    name: 'OverallIndividualLeaveReportModal',
    props: {
        pdfUrl: String
    },
    mounted() {
        const modalElement = document.getElementById('overallIndividualLeaveReportModal');
        if (modalElement) {
            this.modalInstance = new Modal(modalElement);
        }
    },
    methods: {
        openModal() {
            if (this.modalInstance) {
                this.modalInstance.show();
            } else {
                const modalElement = document.getElementById('overallIndividualLeaveReportModal');
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
.pdf-container {
    height: 600px;
    width: 100%;
    overflow: hidden;
}

.pdf-container iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.modal-xl {
    max-width: 90%;
}

.modal-body {
    background-color: #f5f5f5;
}

.py-4 {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.text-center {
    text-align: center;
}

.text-muted {
    color: #6c757d;
}
</style>
